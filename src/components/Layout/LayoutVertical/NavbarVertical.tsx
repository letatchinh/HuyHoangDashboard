import { Menu } from 'antd';
import React, { useCallback, useMemo, useState , isValidElement} from 'react';
import NavbarItems from './resource';
import { useGetPolicyCheckAllPage } from '~/modules/user/user.hook';
import { useProfile } from '~/modules/auth/auth.hook';
import { isMatchPolicy, useUserPolicy } from '~/modules/policy/policy.hook';
import { get } from 'lodash';
import { NavLink } from 'react-router-dom';


/**
 * 
 * FIXME: ACTIVE NAVBAR IS NOT WORKING
 */
const NavbarVertical: React.FC = () => {
  const WithPermissions = useCallback((component: any, isMatchPolicy: any) => isMatchPolicy ? component : null, []);
  const validIcon = (icon?: any) => isValidElement(icon) ? icon : <i className="uil-apps me-2"></i>;

  const [collapsed, setCollapsed] = useState(false);
  const [isLoading, policy] = useGetPolicyCheckAllPage();
  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const [profile] = useProfile();
  const [, , policies] = useUserPolicy();
  const checkPermission = useCallback((requiredPermission: string[][]) => {
    if (profile?.isSuperAdmin) {
      return true;
    }
    if (!requiredPermission) return true;

    for (const permissionItem of requiredPermission) {
      if (isMatchPolicy(policies, permissionItem)) {
        return true;
      }
    }

    return isMatchPolicy(policies, requiredPermission);
  }, [policies, profile?.isSuperAdmin]);

  

  return (
    <div className='layoutVertical--content__navbar'>
      {/* <button onClick={toggleCollapsed}>asd</button> */}
      <div className='layoutVertical--content__navbar__wrapMenu'>
    
      <Menu
      className='layoutVertical--content__navbar__wrapMenu__menu'
        mode="inline"
        inlineCollapsed={collapsed}
        items={NavbarItems}
        theme='dark'
        />
      </div>
    </div>
  );
};

export default NavbarVertical;
