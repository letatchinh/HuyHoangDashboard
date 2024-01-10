// import { AppstoreFilled, AppstoreOutlined, ShopFilled,ApartmentOutlined } from "@ant-design/icons";
import {
  AppstoreFilled,
  AppstoreOutlined,
  DatabaseOutlined,
  DollarOutlined,
  HddOutlined,
  HomeOutlined,
  TrophyOutlined,
  ApartmentOutlined,
  ShopFilled,
} from "@ant-design/icons";
import { MenuProps } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
type MenuItem = Required<MenuProps>["items"][number];
function getItem({ label, icon, children, path, key }: ItemType): any {
  return {
    key,
    icon,
    children,
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
  } as MenuItem;
}
type ItemType = {
  label: string;
  icon?: React.ReactNode;
  children?: ItemType[];
  path?: string;
  key: string;
};

const resource: ItemType[] = [
  {
    label: "WorldPharmaVN",
    key: "WorldPharmaVN",
    icon: <AppstoreFilled />,
    children: [
      {
        label: "Cài đặt",
        key: "WorldPharmaVN-setting",
        icon: <AppstoreFilled />,
        children: [
          {
            label: "Cấu hình danh mục",
            path: PATH_APP.worldPharma.productGroup,
            key: PATH_APP.worldPharma.productGroup,
            icon: <HddOutlined />,
          },
          {
            label: "Danh sách nhà sản xuất",
            path: PATH_APP.worldPharma.manufacturer,
            key: PATH_APP.worldPharma.manufacturer,
            icon: <HomeOutlined />,
          },
          {
            label: "Xếp hạng nhà sản xuất",
            path: PATH_APP.worldPharma.ranking,
            key: PATH_APP.worldPharma.ranking,
            icon: <TrophyOutlined />,
          },
          {
            label: "Đơn vị tính",
            path: PATH_APP.worldPharma.unit,
            key: PATH_APP.worldPharma.unit,
            icon: <DollarOutlined />,
          },
          {
            label: "Danh sách thuốc",
            path: PATH_APP.worldPharma.medicine,
            key: PATH_APP.worldPharma.medicine,
            icon: <DatabaseOutlined />,
          },
        ],
      },
    ],
  },

  // Nhà cung cấp
  {
    label: "Nhà cung cấp",
    icon: <ShopFilled />,
    path: PATH_APP.supplier.root,
    key: PATH_APP.supplier.root,
  },

      // Chi nhánh
    getItem({
      label : "Chi nhánh",
      key : "branch",
      // Children
      children : [
        getItem({
          label : "Danh sách chi nhánh",
          path : PATH_APP.branch.root,
          key : PATH_APP.branch.root,
        })
      ],
      icon :<AppstoreFilled />
    }),
    {
      label: "Quản lý công việc",
      key: "todoList",
      icon: <AppstoreFilled />,
      children: [
        {
          label: "Quản lý công việc",
          // key: "statusConfig",
          icon: <ApartmentOutlined />,
          path: PATH_APP.todoList.workBoard,
          key: PATH_APP.todoList.workBoard,
          
        },
        {
          label: "Cấu hình trạng thái",
          // key: "statusConfig",
          icon: <AppstoreFilled />,
          path: PATH_APP.todoList.statusConfig,
          key: PATH_APP.todoList.statusConfig,
          
        },
      ],
    },
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

const NavbarItems = resource.map((first) => {
  if (first.children?.length) {
    const newChildFirst = first.children.map((second) => {
      if (second.children?.length) {
        const newChildSecond = second.children.map((third) => getItem(third));
        return getItem({ ...second, children: newChildSecond });
      } else {
        return getItem(second);
      }
    });
    return getItem({ ...first, children: newChildFirst });
  } else {
    return getItem(first);
  }
});

export default NavbarItems;
