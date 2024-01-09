import { AppstoreFilled, AppstoreOutlined } from "@ant-design/icons";
import { MenuProps } from "antd";
import React from "react";
import { NavLink } from "react-router-dom";
import { PATH_APP } from "~/routes/allPath";
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
            path: PATH_APP.worldPharma.productConfig,
            key: PATH_APP.worldPharma.productConfig,
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
  },

  // Chi nhánh
  getItem({
    label: "Chi nhánh",
    key: "branch",
    // Children
    children: [
      getItem({
        label: "Danh sách chi nhánh",
        path: PATH_APP.branch.root,
        key: PATH_APP.branch.root,
      })
    ],
    icon: <AppstoreFilled />
  }),
  {
    label: "Nhà thuốc",
    icon: <AppstoreOutlined />,
    path: PATH_APP.pharmacy.root,
    key: PATH_APP.pharmacy.root,
  },
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
