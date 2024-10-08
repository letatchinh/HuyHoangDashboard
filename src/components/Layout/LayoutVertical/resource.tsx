import {
  AppstoreOutlined,
  DiffOutlined,
  UsergroupAddOutlined
} from "@ant-design/icons";
import React from "react";
import { PATH_APP } from "~/routes/allPath";

export type ItemTypeNavbar = {
  label: string;
  icon?: React.ReactNode;
  children?: ItemTypeNavbar[];
  path?: string;
  key: string;
  permission?: any;
};

export const resource: ItemTypeNavbar[] = [
  {
    label: "Nhóm khoá học",
    key: "courseGroup",
    icon: <AppstoreOutlined />,
    path: PATH_APP.courseGroup.root,
  },
  {
    label: "Khoá học",
    key: "course",
    icon: <DiffOutlined />,
    path: PATH_APP.course.root,
  },
  // {
  //   label: "Tài khoản",
  //   key: "account",
  //   icon : <UserOutlined />,
  //   path : PATH_APP.user.root
  // },
  {
    label: "Người dùng",
    key: "staff",
    icon: <UsergroupAddOutlined />,
    path: PATH_APP.staff.root,
  },
  {
    label: "Giảng viên",
    key: "teacher",
    icon: <UsergroupAddOutlined />,
    path: PATH_APP.teacher.root,
  },
];
