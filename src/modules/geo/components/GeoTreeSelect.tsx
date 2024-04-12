import { useEffect, useMemo, useState } from "react";

import { Grid, TreeSelect } from "antd";
import { compact, concat, get, head, isArray, sortBy, split, unionBy } from "lodash";
import subvn from "~/core/subvn";
import { RELATIVE_POSITION } from "../constants";

const { useBreakpoint } = Grid;

/**
 * Return positive number if p1 starts with p2 and p1 is longer than p2,
 * return negative number if p2 starts with p1 and p2 is longer than p1,
 * return 0 if 2 paths are identical,
 * return null if 2 paths does not start with the other.
 *
 * @param {String} p1 first path
 * @param {String} p2 second path
 * @param {String} separator separator
 * @return {Number}
 */
const getDiffBetweenPaths = (p1: string, p2: string, separator?: string) => {
  const sep = separator || "/";
  if (p1.startsWith(p2)) {
    const diff = compact(p1.substring(p2.length, p1.length).split(sep));
    return diff.length;
  } else if (p2.startsWith(p1)) {
    const diff = compact(p2.substring(p1.length, p2.length).split(sep));
    return -diff.length;
  }
  return null;
};

const GeoTreeSelect = ({
  checkablePositions = Object.values(RELATIVE_POSITION),
  enabledValues,
  onChange,
  showEnabledValuesOnly,
  enableToSelectAllEnabledValues,
  value,
  ...restProps
}: any) => {
  const [selectedCityCode, setSelectedCityCode] = useState<any>();

  const [selectedDistrictCode, setSelectedDistrictCode] = useState<any>();

  const areas = useMemo(() => subvn.getAreas(), []);
  const cities = useMemo(() => subvn.getProvinces(), []);
  const wards : any[] = useMemo(
    () => {
      if(restProps?.multiple || Number.isFinite(selectedDistrictCode)){
        let rs : any = []; 
        if(!selectedDistrictCode) return []
        if(isArray(selectedDistrictCode)){
          selectedDistrictCode?.forEach((code:any) => rs = rs.concat(subvn.getWardsByDistrictCode(code)))
          return rs
        }
      }
      return subvn.getWardsByDistrictCode(selectedDistrictCode)
    },
    [selectedDistrictCode,restProps?.multiple]
  );
  const districts : any[] = useMemo(
    () => {
      if(restProps?.multiple || Number.isFinite(selectedCityCode)){
        let rs : any = []; 
        if(!selectedCityCode) return []
        if(isArray(selectedCityCode)){
          selectedCityCode?.forEach((code:any) => rs = rs.concat(subvn.getDistrictsByProvinceCode(code)))
          return rs
        }
      }
      return subvn.getDistrictsByProvinceCode(selectedCityCode)
    },
    [selectedCityCode,restProps?.multiple]
  );
  

  const [treeData, setTreeData] = useState([]);
  
  const screens = useBreakpoint();

  let listHeight = 256;
  if (screens.xl) listHeight = 320;
  if (screens.xxl) listHeight = 512;

  const buildPath = (codes: any, givenSeparator?: any) => {
    const separator = givenSeparator || "/";
    return `${separator}${codes.join(separator)}`;
  };

  /**
   * Returns the relative position of given path to the enabledValues.
   * The priority is IS_CHILD > IS_EQUAL > IS_PARENT.
   *
   * @param {String} path
   * @return {String}
   */
  const getRelativePosition = (path: string) => {
    if (!enabledValues) return RELATIVE_POSITION.IS_CHILD;

    let position;
    enabledValues?.some((item: any) => {
      const diff = getDiffBetweenPaths(path, item);
      if (diff !== null) {
        position =
          diff === 0
            ? RELATIVE_POSITION.IS_EQUAL
            : diff > 0
            ? RELATIVE_POSITION.IS_CHILD
            : RELATIVE_POSITION.IS_PARENT;
        return true;
      } else {
        position = undefined;
      }
    });

    return position;
  };

  const getShouldShow = (path: any) => {
    let isShow = !showEnabledValuesOnly;
    if (showEnabledValuesOnly) {
      const position = getRelativePosition(path);
      isShow = !!position;
    }

    return isShow;
  };

  useEffect(() => {
    const valuePaths = get(restProps, "multiple")
      ? value?.map((item: any) => get(item, "value")) || []
      : [];

    const newTree: any = unionBy(treeData, areas, "code")
      .filter((area) => getShouldShow(buildPath([get(area, "code", "")])))
      .map((area: any, a) => {
        const { code, name } = area;

        const kA = code;
        const pathA = `/${kA}`;
        const position = getRelativePosition(pathA);

        return {
          isLeaf: false,
          ...area,
          key: pathA, // to be used for submitting to API and to ensure it is unique
          value: pathA, // to be used for submitting to API and to ensure it is unique
          title: name, // to show on the dropdown
          unit: "area",
          checkable:
            checkablePositions.includes(position) ||
            enableToSelectAllEnabledValues,
          selectable: checkablePositions.includes(position),
          disabled:
            !checkablePositions.includes(position) &&
            !enableToSelectAllEnabledValues,

          children: unionBy(
            get(treeData, [a, "children"].join(".")) || [],
            cities,
            "code"
          )
            .filter(
              (city) =>
                parseInt(get(city, "area_code", "")) === parseInt(code) &&
                getShouldShow(buildPath([kA, get(city, "code")]))
            )
            .map((city: any, c) => {
              const { code, name } = city;
              const kC = code;
              const pathC = "/".concat([kA, kC].join("/"));
              const parentSelected = valuePaths?.some(
                (item: any) =>
                  pathC?.length > item?.length && pathC.startsWith(item)
              );
              const position = getRelativePosition(pathC);

              return {
                isLeaf: false,
                ...city,
                key: pathC,
                value: pathC,
                title: name,
                unit: "city",
                checkable:
                  !parentSelected &&
                  (checkablePositions.includes(position) ||
                    enableToSelectAllEnabledValues),
                selectable:
                  !parentSelected && checkablePositions.includes(position),
                disabled:
                  parentSelected ||
                  (!checkablePositions.includes(position) &&
                    !enableToSelectAllEnabledValues),
                children: unionBy(
                  get(treeData, [a, "children", c, "children"].join(".")) || [],
                  districts,
                  "code"
                )
                  .filter(
                    (district) =>
                      parseInt(get(district, "province_code", "")) ===
                        parseInt(code) &&
                      getShouldShow(buildPath([kA, kC, get(district, "code")]))
                  )
                  .map((district: any, d) => {
                    const { code, name } = district;
                    const kD = code;
                    const pathD = "/".concat([kA, kC, kD].join("/"));
                    const parentSelected = valuePaths?.some(
                      (item: any) =>
                        pathD?.length > item?.length && pathD.startsWith(item)
                    );
                    const position = getRelativePosition(pathD);

                    return {
                      isLeaf: false, // OPEN WARD
                      ...district,
                      key: pathD,
                      value: pathD,
                      title: name,
                      unit: "district",
                      checkable:
                        !parentSelected &&
                        (checkablePositions.includes(position) ||
                          enableToSelectAllEnabledValues),
                      selectable:
                        !parentSelected &&
                        checkablePositions.includes(position),
                      disabled:
                        parentSelected ||
                        (!checkablePositions.includes(position) &&
                          !enableToSelectAllEnabledValues),

                      children: unionBy(
                        get(
                          treeData,
                          [a, "children", c, "children", d, "children"].join(
                            "."
                          )
                        ) || [],
                        wards,
                        "code"
                      )
                        .filter(
                          (ward: any) =>
                            parseInt(ward.district_code) === parseInt(code) &&
                            getShouldShow(buildPath([kA, kC, kD, ward.code]))
                        )
                        .map((ward: any, w) => {
                          const { code, name } = ward;
                          const kW = code;
                          const pathW = "/".concat([kA, kC, kD, kW].join("/"));
                          const parentSelected = valuePaths?.some(
                            (item: any) =>
                              pathW?.length > item?.length &&
                              pathW.startsWith(item)
                          );
                          const position = getRelativePosition(pathW);

                          return {
                            isLeaf: true,
                            ...ward,
                            key: pathW,
                            value: pathW,
                            title: name,
                            unit: "ward",
                            checkable:
                              !parentSelected &&
                              checkablePositions.includes(position),
                            selectable:
                              !parentSelected &&
                              checkablePositions.includes(position),
                            disabled:
                              parentSelected ||
                              !checkablePositions.includes(position),
                          };
                        }),
                    };
                  }),
              };
            }),
        };
      });
    setTreeData(newTree);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [areas, cities, districts, wards, value]);

  useEffect(() => {
    if (value) {
      if (restProps?.multiple) {
        let selectCityCodeArr: any = [];
        let selectDistrictCodeArr: any = [];
        value?.forEach((v: any) => {
          const pathCodes: any = split(v, "/");

          // if the path represent selection matching to district level, fetch data of the province
          if (pathCodes.length >= 4) {
            selectCityCodeArr.push(pathCodes?.[2]);
            selectDistrictCodeArr.push(pathCodes?.[3]);
          }
        });
        setSelectedCityCode(selectCityCodeArr);
        setSelectedDistrictCode(selectDistrictCodeArr);
      } else {
        const pathCodes: any = split(value, "/");

        // if the path represent selection matching to district level, fetch data of the province
        if (pathCodes.length >= 4) {
          setSelectedCityCode(pathCodes?.[2]);
          setSelectedDistrictCode(pathCodes?.[3]);
        }
      }
    }
  }, [value]);

  const onLoadData = (leaf: any) => {
    const { value, unit, code } = leaf;

    switch (unit) {
      case "city":
        setSelectedCityCode(code);
        break;
      case "district":
        setSelectedDistrictCode(code);
        break;
      default:
        break;
    }

    return new Promise((resolve, reject) => {
      resolve("");
    });
  };

  /**
   * Clean value before emitting onChange prop.
   *
   * @param {*} value
   */
  const onTreeSelectChange = (value: any) => {
    // only clean value in multiple mode enabled
    if (get(restProps, "multiple")) {
      if (get(restProps, "labelInValue")) {
        // Firstly, sort the value so that all item's `value` (which contains the address path)
        // are in order from smallest to largest
        // so we can easily reduce the value.

        // For example, base on how user selects the items, value can be:
        // [
        //   { value: '/03/77', label: 'Tỉnh Bà Rịa - Vũng Tàu' },
        //   { value: '/03', label: 'Miền Nam' },
        //   { value: '/01', label: 'Miền Bắc' },
        //   { value: '/02', label: 'Miền Trung' },
        //   { value: '/03/79', label: 'Thành phố Hồ Chí Minh' },
        // ]

        // then expected sorted result is:
        // [
        //   { value: '/01', label: 'Miền Bắc' },
        //   { value: '/02', label: 'Miền Trung' },
        //   { value: '/03', label: 'Miền Nam' },
        //   { value: '/03/77', label: 'Tỉnh Bà Rịa - Vũng Tàu' },
        //   { value: '/03/79', label: 'Thành phố Hồ Chí Minh' },
        // ]
        const sortedValue = sortBy(value, "value");

        // Before reducing this `sortedValue` from first to last item,
        // init "currentParent" by using the first item:
        let currentParent = head(sortedValue);

        // Reduce the `sortedValue` by iterating from first to last item,
        // the initial item of this reduce step should be first item of `sortedValue`
        const reducedValue = sortedValue.reduce(
          (prev, curr) => {
            // For each current item `curr`,
            // check whether it contains child path of the current parent
            // by the "value" attribute.

            // Using the example above:
            //   { value: '/03', label: 'Miền Nam' } is NOT child of { value: '/02', label: 'Miền Trung' }
            //   { value: '/03/77', label: 'Tỉnh Bà Rịa - Vũng Tàu' } is child of { value: '/03', label: 'Miền Nam' }
            const isCurrentChildOfCurrentParent = get(curr, "value").startsWith(
              get(currentParent, "value")
            );

            if (isCurrentChildOfCurrentParent) {
              // If current item is child of current parent, skip (don't include them) the in reduced value
              // because, for example, if user already selected { value: '/03', label: 'Miền Nam' },
              // we don't need to include { value: '/03/77', label: 'Tỉnh Bà Rịa - Vũng Tàu' }
              // as according to business logic, user already has control to all paths under '/03' (sub areas of 'Miền Nam')
              return prev;
            } else {
              // Otherwise, we update the currentParent with current item value:
              currentParent = curr;

              // and we include the current item in reduced value:
              return prev.concat(curr);
            }
          },
          currentParent ? [currentParent] : []
        );

        // finally emit the reducedValue to the parent component of this GeoTreeSelect
        // (usually for the Antd Form.Item)
        onChange(reducedValue);
      }
    } else {
      // otherwise, emit the value as usual
      onChange(value);
    }
  };

  return (
    <TreeSelect
      listHeight={listHeight}
      value={value}
      {...restProps}
      getPopupContainer={(trigger) => trigger.parentNode}
      onChange={onTreeSelectChange}
      allowClear
      filterTreeNode
      loadData={onLoadData}
      optionFilterProp="full_name"
      showSearch
      treeData={treeData}
      treeNodeFilterProp="full_name"
      treeNodeLabelProp="name"
    />
  );
};

export default GeoTreeSelect;
