import { ConfigProvider, Menu, MenuProps, Tooltip } from 'antd';
import React, { useCallback, useMemo, useState , isValidElement, useEffect} from 'react';
import NavbarItems, { resource } from './resource';
import { useGetPolicyCheckAllPage } from '~/modules/user/user.hook';
import { useGetProfile, useProfile } from '~/modules/auth/auth.hook';
import { isMatchPolicy, useUserPolicy } from '~/modules/policy/policy.hook';
import { NavLink } from 'react-router-dom';
import NavbarItem from './NavbarItem';
import { keys } from 'lodash';


/**
 * 
 * FIXME: ACTIVE NAVBAR IS NOT WORKING
 */

type MenuItem = Required<MenuProps>["items"][number];
type ItemType = {
  label: string;
  icon?: React.ReactNode;
  children?: ItemType[];
  path?: string;
  key: string;
  permission?: any; 
};

function getItem({ label, icon, children, path, key, permission }: ItemType): any {
  return {
    key,
    icon,
    children,
    permission,
    label: <NavbarItem label={label} path={path}/>
    
  } as MenuItem 
};
const NavbarVertical: React.FC = () => {

  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, policy] = useGetPolicyCheckAllPage();
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const profile = useGetProfile();
  const [, , policies] = useUserPolicy();
  // const [filteredResource,setFilteredResource]:any = useState([]);

  // useEffect(() => {
    const checkPermission = (permission: any) : boolean => {
      if (!permission || profile?.user?.isSuperAdmin ) return true;
      
      for (const permissionItem of permission) {
          if (isMatchPolicy(policies, permissionItem)) {
            return true;
        };
      };
      return false;
  
    }
  
    const filterItems = (items: ItemType[]) => {
      return items.filter((item: ItemType) => {
        if ( !!item?.children?.length) {
          item.children = filterItems(item.children);
        };
        return checkPermission(item?.permission);
        
      });
    };
  //   if(policies && !!keys(policies).length){
  //     const filteredResource = filterItems(resource);
  //     setFilteredResource(filteredResource)
  //   };
  // },[policies])
  const filteredResource = filterItems(resource);
    const NewNavbarItems : any = filteredResource?.map((first : any) => {
  if (first.children?.length) {
    const newChildFirst = first.children.map((second : any) => {
      if (second.children?.length) {
        const newChildSecond = second.children.map((third : any) => getItem(third));
        return getItem({ ...second, children: newChildSecond });
      } else {
        return getItem(second)};
    })
    return getItem({ ...first, children: newChildFirst })
  } else {
    return getItem(first)
  };
  });
  
  return (
    <div className='layoutVertical--content__navbar'>
      {/* <button onClick={toggleCollapsed}>asd</button> */}
      <div className='layoutVertical--content__navbar__wrapMenu'>
      <ConfigProvider theme={{
        components : {
          Menu : {
            itemMarginInline : 0,
            itemMarginBlock : 0,
          }
        }
      }}>
      <Menu

      className='layoutVertical--content__navbar__wrapMenu__menu'
      mode="inline"
      inlineCollapsed={collapsed}
      items={NewNavbarItems}
      theme='dark'

      />
      </ConfigProvider>
      </div>
    </div>
  );
};

export default NavbarVertical;
