import { Button, Drawer, Menu, MenuProps, Spin, Tooltip } from 'antd';
import React, {  useState , useEffect} from 'react';
import { resource } from './resourceV2';
import { useGetPolicyCheckAllPage } from '~/modules/user/user.hook';
import { useGetProfile, useProfile } from '~/modules/auth/auth.hook';
import { isMatchPolicy, useUserPolicy } from '~/modules/policy/policy.hook';
import NavbarItem from './NavbarItem';
import { keys } from 'lodash';
import { MenuFoldOutlined, MenuUnfoldOutlined } from '@ant-design/icons';


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
const NavbarVerticalDevice: React.FC = () => {

  const [collapsed, setCollapsed] = useState(false);

  const [open, setOpen] = useState(false);

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const profile = useGetProfile();
  const [isLoadingPolicy, , policies] = useUserPolicy();
  const [filteredResource,setFilteredResource]:any = useState([]);

  useEffect(() => {
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
    if(profile?.user?.isSuperAdmin || (policies && !!keys(policies).length)){
      const filteredResource = filterItems(resource);
      setFilteredResource(filteredResource)
    };
  },[policies]);
  // const filteredResource = filterItems(resource);
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
    <div className={`layoutVertical--content__navbar--device`}>
        <Button type="primary" onClick={showDrawer} style={{ marginBottom: 10, backgroundColor : 'transparent', color : 'black' }} className='layoutVertical--content__navbar--device__button--collapse'>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </Button>
      {isLoadingPolicy && <Spin className='layoutVertical--content__navbar__loading' tip="Đang lấy dữ liệu phân quyền"/>}
      <Drawer
        title=""
        onClose={onClose}
        open={open}
        style={{padding : 0}}
        children={<Menu
        className='layoutVertical--content__navbar__wrapMenu__menu menu--device'
        mode="inline"
        inlineCollapsed={collapsed}
        items={NewNavbarItems}
        theme='dark'
        />}
        />
    </div>
  );
};

export default NavbarVerticalDevice;
