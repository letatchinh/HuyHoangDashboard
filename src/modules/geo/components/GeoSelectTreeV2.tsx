import { CaretDownOutlined, CarryOutOutlined } from '@ant-design/icons';
import { Checkbox, TreeSelect } from 'antd';
import { TreeSelectProps } from 'antd/lib/index';
import { filter, hasIn, pull, unset, xor } from 'lodash';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import subVn from 'sub-vn';
import {
  getDistrictsByProvinceCode,
  getProvindByAreaCode,
  onRegexDiffMap,
  onRegexMap,
} from './handle';
let areas = subVn.getDistricts();
interface PropsType extends Omit<TreeSelectProps,'onChange'>  {
  blackList? : string[],
  parentList? : string[],
  initalValue? : string[],
  onChange? : (p?: any,p2?:any,p3?:any) => void
}

const Item = ({
  name,
  path,
  valid,
  indeterminate = () => false,
  onChange = () => {},
}:any) => {
  return (
    <div>
      {Boolean(valid.childIsHasBlacklist) && !valid.disabled && (
        <Checkbox
          style={{ marginRight: 12, marginLeft: -4 }}
          indeterminate={indeterminate()}
          onChange={(e) => {
            onChange(path, e.target.checked);
          }}
          checked={indeterminate()}
        />
      )}
      {name}
      {/* {`. ${JSON.stringify(valid)} `} */}
    </div>
  );
};

const GeoSelectTreeV2 = ({
  onChange,
  blackList = [],
  parentList = [],
  initalValue,
  ...props
}:PropsType) => {

  const [_value, setValue] = useState<string[]>([]);
  
  const [_blackList, setBlackList] = useState<string[]>([]);
  const [treeExpandedKeys, setKeyExpend] = useState<string[]>([]);
  const [parent, setParent] = useState<string[]>([]);
  useEffect(() => {
    blackList && setBlackList(blackList);
  }, [blackList]);
  useEffect(() => {
    parentList && setParent(parentList);
  }, [parentList]);
  const initalValueMemo = useMemo(
    () => (initalValue ? initalValue : []),
    [initalValue]
  );
console.log(parent,'parent')
  useEffect(() => {
    initalValueMemo && setValue(initalValueMemo);
  }, [initalValueMemo]);

  const endDataa = useMemo(() => {
    let endData : any[] = [];
    let blackListCheck = (c:any, blackLists = _blackList) => {
      return blackLists.some((v) => {
        return _regex(v).test(c) && _regex(c).test(v);
      });
    };
    let checkParent = (c:any, v_ = false) => {
      return parent.some((v) => {
        const end = v_ ? c : v;
        const regex = new RegExp('^' + end, 'ig');
        return regex.test(v_ ? v : c);
      });
    };
    let _blackList_ = _blackList.filter((e) => !checkParent(e, true));

    let disableCheckbox = (c:any) => {
      if (!parent.length) {
        return blackListCheck(c);
      }
      if (initalValueMemo.length) {
        return (
          blackListCheck(c, _blackList_) ||
          !(checkParent(c, true) || checkParent(c)) ||
          xor(_blackList_, initalValueMemo).includes(c)
        );
      }
      return (
        blackListCheck(c, _blackList_) ||
        !(checkParent(c, true) || checkParent(c))
      );
    };
    const _regex = (pattern : any) => new RegExp('^' + pattern, 'ig');
    const shold = (n:any) => Number(n);
    const onChange = (paths:any, checked:any) => {
      if (checked) {
        let tree1 = filter(paths.split('/'), Boolean);
        let results : any = [];
        let chekdata : any = {};
        let isLift = false;
        switch (tree1.length) {
          // @ts-ignore
          case 1: {
            const listCity = getProvindByAreaCode(tree1.at(-1));
            console.log(listCity,'listCity')
            let listAvaiable = listCity.filter((path : any) => {
              if (parent.length) {
                //quy mô khả dụng nằm trong cấp cha
                let existsParent = parent.some(onRegexMap(path));
                let existsHalfChildren = parent.some(onRegexDiffMap(path));
                if (initalValueMemo.length) {
                  let existManager = initalValueMemo.some(onRegexMap(path));
                  let existHalfManager = initalValueMemo.some(
                    onRegexDiffMap(path)
                  );
                  return (
                    existsParent ||
                    existsHalfChildren ||
                    existManager ||
                    existHalfManager
                  );
                }
                return !(disableCheckbox(path) && !initalValueMemo.includes(path))
              } else {
                // xác định quy mô dựa trên danh sách blackList
                return true;
              }
            });

            listAvaiable.map((path : any) => {
              chekdata[path] = _blackList.filter((bl) => {
                return _regex(path).test(bl) && path != bl;
              });

              if (!chekdata[path].length) {
                unset(chekdata, path);
              }
            });
            results = results.concat(listAvaiable);
            isLift = true;
          }
          // @ts-ignore
          case 2: {
            if (isLift) {
              let listPullOut : any[] = [];

              results.forEach((path : any) => {
                if (hasIn(chekdata, path)) {
                  listPullOut.push(path);
                  let tree2 = filter(path.split('/'), Boolean);
                  let listDistricts = getDistrictsByProvinceCode(tree2.at(-1));
                  listDistricts = listDistricts.filter((district) => {
                    if (initalValueMemo.length) {
                      return (
                        initalValueMemo.includes(district) ||
                        !chekdata[path].includes(district)
                      );
                    }
                    return !chekdata[path].includes(district);
                  });

                  results.push(...listDistricts);
                }
              });
              pull(results, ...listPullOut);
            } else {
              let listDistricts = getDistrictsByProvinceCode(tree1.at(-1));
              listDistricts = listDistricts.filter((district) => {
                if (initalValueMemo.length) {
                  return (
                    initalValueMemo.includes(district) ||
                    !_blackList.includes(district)
                  );
                }
                return !_blackList.includes(district);
              });
              results.push(...listDistricts);
            }
          }
          // case 3: {
          //   const listWards = subVn.getWardsByDistrictCode(tree1.at(-1));
          //   let listWards_ = listWards.map(
          //     ({ area_code, province_code, district_code, code }) =>
          //       ['', area_code, province_code, district_code, code].join('/')
          //   );
          // }
          default: {
          }
        }

        setValue([..._value, ...results]);
        onHandleChange([..._value, ...results]);
      } else {
        let result = _value.filter((e) => !_regex(paths).test(e));
        onHandleChange(result);
        setValue(result);
      }
    };
    const return_ = (name : any, path : any, code : any, isLeaf = false) => {
      let valid = {
        childIsHasBlacklist: _blackList.filter(
          (e) => _regex(path).test(e) && path != e
        ).length,
        disabled: disableCheckbox(path),
      };
      return {
        title: (
          <Item
            key={path}
            name={name}
            path={path}
            valid={valid}
            onChange={onChange}
            indeterminate={() => _value.some(onRegexMap(path))}
          />
        ),
        icon: <CarryOutOutlined />,
        value: path,
        key: path,
        code,
        selectable: false,
        checkable:
          (!valid.childIsHasBlacklist && !disableCheckbox(path)) ||
          initalValueMemo.includes(path),
        // checkable: true,
        disabled: disableCheckbox(path) && !initalValueMemo.includes(path),
        isLeaf: isLeaf || disableCheckbox(path),
      };
    };
    areas.forEach(
      ({ area_code, province_code, code, area_name, province_name, name }) => {
        let areaI = endData?.[shold(area_code)];
        let provinces = areaI?.children;
        let province = provinces?.[shold(province_code)];
        let districts = province?.children;
        let district = districts?.[shold(code)];

        let areaCode = ['', area_code].join('/');
        let provinceCode = [areaCode, province_code].join('/');
        let districtCode = [provinceCode, code].join('/');

        if (!areaI) {
          endData[shold(area_code)] = return_(area_name, areaCode, area_code);
        }
        if (!province) {
          if (!provinces) {
            endData[shold(area_code)].children = [];
          }
          endData[shold(area_code)].children[shold(province_code)] = return_(
            province_name,
            provinceCode,
            province_code
          );
        }

        if (!district) {
          if (!districts) {
            endData[shold(area_code)].children[shold(province_code)].children =
              [];
          }
          endData[shold(area_code)].children[shold(province_code)].children[
            shold(code)
          ] = return_(name, districtCode, code, true);
        }
      }
    );
    function loops(data : any) {
      if (data?.children) {
        data.children = data.children.filter((c1:any) => c1);
        data.children.forEach(loops);
      }
    }
    endData.forEach(loops);
    let data = endData;

    return data;
  }, [_blackList, parent, _value, initalValueMemo]);

  const onHandleChange = useCallback(
    (newValue: any) => {
      if (typeof onChange === 'function') {
      return onChange(newValue);
    }
  }, []);

  const onChangeLocal = useCallback(
    (newValue: any, labelList: React.ReactNode[], extra: any) => {
      setValue(newValue);
      onHandleChange(newValue);
    },
    [onHandleChange]
  );

  const tProps : TreeSelectProps = {
    treeData: endDataa,
    allowClear: true,
    // value: _value,
    onChange: onChangeLocal,
    treeLine: true,
    onTreeExpand: (v : any) => {
      setKeyExpend(v);
    },
    size: 'large',
    treeExpandedKeys,
    treeCheckStrictly: false,
    switcherIcon: <CaretDownOutlined />,
    treeCheckable: true,
    multiple: true,
    showCheckedStrategy: TreeSelect.SHOW_PARENT,
    placeholder: 'Vui lòng chọn',
    style: {
      width: '100%',
    },
    ...props,
    ...{ value: _value },
  };

  return <TreeSelect {...tProps} />;
};
export default GeoSelectTreeV2;
