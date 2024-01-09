import Auth from "~/modules/auth";
import { PathRouteProps } from 'react-router-dom';
import { PATH_APP } from "./allPath";
import Homepage from "~/pages/Dashboard/Homepage";
import Supplier from "~/pages/Dashboard/Supplier";
import Branch from "~/pages/Dashboard/Branch";
import ConfigDiscountPage from "~/pages/Dashboard/ConfigDiscount";
export const mainRoutes :PathRouteProps[] = [
  { path: PATH_APP.main.root, Component: Homepage },
  { path: PATH_APP.supplier.root, Component: Supplier },
  { path: PATH_APP.branch.root, Component: Branch },
  { path: PATH_APP.configDiscount.root, Component: ConfigDiscountPage },

  { path: '/', Component: Homepage },
]

export const authRoutes : PathRouteProps[] = [
    { path: '/login', Component: Auth.page.login },
  ];

