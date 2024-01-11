import { AppstoreFilled, AppstoreOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import React, { useCallback } from "react";
import { NavLink } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
import POLICIES from "~/modules/policy/policy.auth";

type MenuItem = Required<MenuProps>["items"][number];
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
type ItemType = {
  label: string;
  icon?: React.ReactNode;
  children?: ItemType[];
  path?: string;
  key: string;
  permission?: any; 
};
export const resource: ItemType[] = [
  {
    label: "WorldPharmaVN",
    key: "WorldPharmaVN",
    icon: <AppstoreFilled />,
    children: [
      {
        label: "Cài đặt",
        key: "WorldPharmaVN-setting",
        icon: <AppstoreFilled />,
        // permission :[POLICIES.READ_USERGROUP],
        children: [
          {
            label: "Cấu hình danh mục",
            path: PATH_APP.worldPharma.productConfig,
            key: PATH_APP.worldPharma.productConfig,
            // permission :[POLICIES.READ_USERGROUP],
          },
          {
            label: "Cấu hình giảm giá",
            path: PATH_APP.configDiscount.root,
            key: PATH_APP.configDiscount.root,
          },
        ],
      },
    ],
  },

  // Nhà cung cấp
  {
    label: "Nhà cung cấp",
    icon: <AppstoreOutlined />,
    path: PATH_APP.supplier.root,
    key: PATH_APP.supplier.root,
    // permission :[POLICIES.READ_USER],
  },

      // Chi nhánh
    {
      label : "Chi nhánh",
      key : "branch",
      // Children
      children : [
        {
          label : "Danh sách chi nhánh",
          path : PATH_APP.branch.root,
          key : PATH_APP.branch.root,
        }
      ],
      icon :<AppstoreFilled />,
    },
      //Nhân viên
      {
        label : "Nhân viên",
        icon: <FontAwesomeIcon icon ={faUsers} />,
        path : PATH_APP.employee.root,
        key: PATH_APP.employee.root,
        permission :[POLICIES.READ_EMPLOYEE],
      },
      //Người dùng
      {
        label : "Người dùng",
        icon: <FontAwesomeIcon icon = {faUser} />,
        path : PATH_APP.user.root,
        key : PATH_APP.user.root,
    },
        //Nhà thuốc
    {
      label: "Nhà thuốc",
      icon: <AppstoreOutlined />,
      path: PATH_APP.pharmacy.root,
      key: PATH_APP.pharmacy.root,
    },
      
 ];

//Required permission is string[][]; 
const NavbarItems = resource.map((first) => {
      if (first.children?.length) {
        const newChildFirst = first.children.map((second) => {
          if (second.children?.length) {
            const newChildSecond = second.children.map((third) => getItem(third));
            return getItem({ ...second, children: newChildSecond });
          } else {
            return getItem(second)};
        })
        return getItem({ ...first, children: newChildFirst })
      } else {
        return getItem(first)
      };
});
export default NavbarItems;
