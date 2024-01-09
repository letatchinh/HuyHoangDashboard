import Auth from "~/modules/auth";
import { PathRouteProps } from 'react-router-dom';
import { PATH_APP } from "./allPath";
import Homepage from "~/pages/Dashboard/Homepage";
import Supplier from "~/pages/Dashboard/Supplier";
import Branch from "~/pages/Dashboard/Branch";
import EmployeePage from "~/pages/Dashboard/Employee";
import UserPage from "~/pages/Dashboard/User";
import UserGroupPage from "~/pages/Dashboard/UserGroup";
export const mainRoutes :PathRouteProps[] = [
  { path: PATH_APP.main.root, Component: Homepage },
  { path: PATH_APP.supplier.root, Component: Supplier },
  { path: PATH_APP.branch.root, Component: Branch },
  { path: PATH_APP.employee.root, Component: EmployeePage },
  { path: PATH_APP.user.root, Component: UserPage },
  { path: PATH_APP.userGroup.root, Component: UserPage },
  { path: PATH_APP.userGroup.detail, Component: UserPage },

  { path: '/', Component: Homepage },
]

export const authRoutes : PathRouteProps[] = [
    { path: '/login', Component: Auth.page.login },
  ];

