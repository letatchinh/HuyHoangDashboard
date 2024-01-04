import {
  AppstoreFilled,
  AppstoreOutlined, SettingOutlined
} from '@ant-design/icons';
import { Menu, MenuProps } from 'antd';
import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import useTranslate from '~/lib/translation';
import { PATH_APP } from '~/routes/allPath';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser } from '@fortawesome/free-solid-svg-icons';

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
              label : "Cấu hình danh mục",
              path : PATH_APP.worldPharma.productConfig,
              key : PATH_APP.worldPharma.productConfig,
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
    
    //Nhân viên
    getItem({
      label : "Nhân viên",
      icon: <FontAwesomeIcon icon ={faUsers} />,
      path : PATH_APP.employee.root,
      key : PATH_APP.employee.root,
    }),

    //Người dùng
    getItem({
      label : "Người dùng",
      icon: <FontAwesomeIcon icon = {faUser} />,
      path : PATH_APP.user.root,
      key : PATH_APP.user.root,
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
