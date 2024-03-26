import React, { useState, useMemo, useEffect } from 'react';
import { CaretDownOutlined, CarryOutOutlined } from '@ant-design/icons';
import { xor, get } from 'lodash';

import subVn from 'sub-vn';
import { TreeSelect, Checkbox } from 'antd';
import { TreeSelectProps } from 'antd/lib/index';
let areas = subVn.getDistricts();


interface TreeSelectPropsOther extends TreeSelectProps {
  tagRender?:any
}
const Item = ({
  name,
  path,
  valid,
  indeterminate = () => false,
  onChange = () => {},
} : any) => {
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
interface PropsType extends Omit<TreeSelectProps,'onChange'>  {
  blackList? : string[],
  parentList? : string[],
  initValue? : string[],
  onChange? : (p?: any,p2?:any,p3?:any) => void
}
const TreeSelectLocal = ({
  onChange : onChangeForm,
  blackList = [],
  parentList = [],
  initValue,
  ...props
}:PropsType) => {
  const [_value, setValue] = useState<string[]>([]);
  
  const [_blackList, setBlackList] = useState<string[]>([]);
  const [treeExpandedKeys, setKeyExpend] = useState<string[]>([]);
  const [parent, setParent] = useState<string[]>([]);
  
  useEffect(() => {
     setBlackList(blackList);
  }, [blackList]);
  useEffect(() => {
    setParent(parentList);
  }, [parentList]);
  useEffect(() => {
    initValue && setValue(initValue);
  }, [initValue]);

  const endDataa = useMemo(() => {
    let endData : any = [];
    let blackListCheck = (c:any, rex:any, blackLists = _blackList) => {
      let a = Boolean(rex) ? '^' : '';
      return blackLists.some((v) => {
        if (!Boolean(rex)) return v === c;
        const regex = new RegExp(a + v, 'ig');
        let regexx = new RegExp('^' + c, 'ig');

        return regex.test(c) && regexx.test(v);
      });
    };
    let checkParent = (c:any, v_ = false) => {
      return parent.some((v) => {
        const end = v_ ? c : v;
        const regex = new RegExp('^' + end, 'ig');
        return regex.test(v_ ? v : c);
      });
    };
    let disableCheckbox = (c:any) => {
      if (!parent.length) {
        return {
          a: blackListCheck(c, true),
          b: false,
        };
      }
      let _blackList_ = _blackList.filter((e) => !checkParent(e, true));
      return {
        a:
          blackListCheck(c, true, _blackList_) ||
          !(checkParent(c, true) || checkParent(c)),
        b: !checkParent(c) || blackListCheck(c, false, _blackList),
      };
    };
    const _regex = (pattern:any) => new RegExp('^' + pattern, 'ig');
    let _bList : any = xor(_blackList, parent);
    const shold = (n:any) => Number(n);
    const onHandleChange = (paths : any, checked : any) => {
      if (checked) {
        let tree1 = paths.split('/').filter((e:any) => e);
        let results : any = [];

        switch (tree1.length) {
          // @ts-ignore
          case 1: {
            const listCity = subVn.getProvindByAreaCode(tree1.at(-1));
            let listCity_ = listCity.map(({ area_code, code }:any) =>
              ['', area_code, code].join('/')
            );

            let checkStep = listCity_.filter(
              (path:any) =>
                (!_bList.includes(path) &&
                  parent.some((e) => _regex(e).test(path))) ||
                parent.some((e) => _regex(path).test(e))
            );
            // let inParent = checkStep.filter((path) =>
            //   parent.some((e) => _regex(e).test(path))
            // );
            results = results.concat(checkStep);
          }
          // @ts-ignore
          case 2: {
            function functions(endPath:any) {
              const listProvince = subVn.getDistrictsByProvinceCode(
                endPath.at(-1)
              );

              let listProvince_ = listProvince.map(
                ({ area_code, province_code, code }) =>
                  ['', area_code, province_code, code].join('/')
              );

              listProvince_ = listProvince_.filter(
                (cover) =>
                  !_bList.includes(cover) &&
                  (!Boolean(parent.length) ||
                    parent.some((par) => _regex(cover).test(par)) ||
                    parent.some((par) => _regex(par).test(cover)))
              );
              results.push(...listProvince_);
            }
            if (results.length) {
              let fff = results.filter((path:any) => {
                return (
                  _bList.some((pathBl:any) => _regex(path).test(pathBl)) ||
                  _blackList.some((pathBl) => _regex(path).test(pathBl))
                );
              });

              fff.forEach((other:any) => {
                results = results.filter((r:any) => r != other);
                let tree2 = other.split('/').filter((e:any) => e);
                functions(tree2);
              });
            } else {
              functions(tree1);
            }
          }
          default: {
          }
        }
        
        onChangeForm && onChangeForm([..._value, ...results])
        setValue([..._value, ...results]);
      } else {
        let result = _value.filter((e:any) => {
          const regex = new RegExp('^' + paths, 'ig');
          return !regex.test(e);
        });
        onChangeForm && onChangeForm(result)
        setValue(result);
      }
    };
    const return_ = (name : any, path : any, code : any, isLeaf = false) => {
      let valid = {
        childIsHasBlacklist: _blackList.filter(
          (e) => _regex(path).test(e) && path != e
        ).length,
        disabled: disableCheckbox(path).a,
      };
      return {
        title: (
          <Item
            name={name}
            path={path}
            valid={valid}
            onChange={onHandleChange}
            indeterminate={() => _value.some((e:any) => _regex(path).test(e))}
          />
        ),
        icon: <CarryOutOutlined />,
        value: path,
        key: path,
        code,
        selectable: false,
        checkable: !valid.childIsHasBlacklist && !disableCheckbox(path).a,
        disabled: disableCheckbox(path).a,
        // disableCheckbox: disableCheckbox(path).b,
        isLeaf: isLeaf || disableCheckbox(path).a,
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
        data.children = data.children.filter((c1 : any) => c1);
        data.children.forEach(loops);
      }
    }
    endData.forEach(loops);
    let data = endData;

    return data;
  }, [_blackList, parent, _value]);

  const onChangeLocal  = (newValue: any, labelList: React.ReactNode[], extra: any) => {
    setValue(newValue);
    onChangeForm && onChangeForm(newValue,labelList,extra);
  };

  const tProps : TreeSelectPropsOther = {
    allowClear : true,
    treeData: endDataa,
    value : _value,
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
  };

  return <TreeSelect {...tProps} />;
};
export default TreeSelectLocal;
