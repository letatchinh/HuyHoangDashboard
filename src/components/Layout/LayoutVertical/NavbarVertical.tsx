import { Menu, MenuProps } from 'antd';
import React, { useCallback, useMemo, useState , isValidElement} from 'react';
import NavbarItems, { resource } from './resource';
import { useGetPolicyCheckAllPage } from '~/modules/user/user.hook';
import { useProfile } from '~/modules/auth/auth.hook';
import { isMatchPolicy, useUserPolicy } from '~/modules/policy/policy.hook';
import { NavLink } from 'react-router-dom';


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
    label: path ? (
      <NavLink
        className={() => `layoutVertical--content__navbar__navLink`}
        to={path}
      >
        {label}
      </NavLink>
    ) : (
      label
    ),
  } as MenuItem 
};
const NavbarVertical: React.FC = () => {

  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, policy] = useGetPolicyCheckAllPage();
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const [profile] = useProfile();
  const [, , policies] = useUserPolicy();
  const checkPermission = useCallback((permission: any) => {
    if (!permission ) return true;

    for (const permissionItem of permission) {
        if (isMatchPolicy(policies, permissionItem)) {
          return true;
      };
    };
    return false
  }, [policies, profile?.isSuperAdmin]);

  const filterItems = (items: any) => {
    return items.filter((item: any) => {
      const hasPermission = !('permission' in item) || checkPermission(item?.permission) === true;
  
      if (item?.children && item?.children?.length > 0) {
        item.children = filterItems(item.children);
      };
      return hasPermission;
    });
  };
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
    
      <Menu
      className='layoutVertical--content__navbar__wrapMenu__menu'
        mode="inline"
        inlineCollapsed={collapsed}
        items={NewNavbarItems}
        theme='dark'
        />
      </div>
    </div>
  );
};

export default NavbarVertical;
