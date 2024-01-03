import {
  AppstoreFilled,
  AppstoreOutlined, SettingOutlined
} from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useTranslate from '~/lib/translation';
import { PATH_APP } from '~/routes/allPath';
type MenuItem = Required<MenuProps>['items'][number];
type ItemType = {
  label : string,
  icon? : React.ReactNode,
  children? : React.ReactNode[],
  path? : string,
  key : string,
}
function getItem({ label,icon,children,path,key}:ItemType) : any {
  return {
    key,
    icon,
    children,
    label : path ? <NavLink className={() => `layoutVertical--content__navbar__navLink`} to={path}>{label}</NavLink> : label,
  } as MenuItem;
}




/**
 * 
 * FIXME: ACTIVE NAVBAR IS NOT WORKING
 */
const NavbarVertical: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapsed = () => {
    setCollapsed(!collapsed);
  };
  const { t }: any = useTranslate();
  const items: MenuItem[] = [
    // WorldPharmaVN
    getItem({
      label : "WorldPharmaVN",
      key : 'WorldPharmaVN',
      // WorldPharmaVN Children
      children : [
        getItem({
          label : "Cài đặt",
          key : 'WorldPharmaVN-setting',
          icon : <SettingOutlined />,
          children : [
            getItem({
              label : t('product-config'),
              path : PATH_APP.worldPharma.productConfig,
              key : PATH_APP.worldPharma.productConfig,
            }),
            getItem({
              label :  t('manufacturer'),
              path : PATH_APP.worldPharma.manufacturer,
              key : PATH_APP.worldPharma.manufacturer,

            })
          ]
        })
      ],
      icon :<AppstoreFilled />,
    }),
    
    // Nhà cung cấp
    getItem({
      label : "Nhà cung cấp",
      icon : <AppstoreOutlined />,
      path : PATH_APP.supplier.root,
      key : PATH_APP.supplier.root,
    }),
  
    // Chi nhánh
    getItem({
      label : "Chi nhánh",
      key : "branch",
      // Children
      children : [
        getItem({
          label : t("list-branch"),
          path : PATH_APP.branch.root,
          key : PATH_APP.branch.root,
        })
      ],
      icon :<AppstoreFilled />
    }),
    
    
  
  ];
  return (
    <div className='layoutVertical--content__navbar'>
      <div className='layoutVertical--content__navbar__wrapMenu'>
  
      <Menu
      
      className='layoutVertical--content__navbar__wrapMenu__menu'
        defaultSelectedKeys={[PATH_APP.branch.root]}
        defaultOpenKeys={['branch']}
        mode="inline"
        inlineCollapsed={collapsed}
        items={items}
      />
          {/* <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
        {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
      </Button> */}
      </div>
    </div>
  );
};

export default NavbarVertical;
