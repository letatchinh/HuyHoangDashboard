import Auth from "~/modules/auth";
import { PathRouteProps } from 'react-router-dom';
import { PATH_APP } from "./allPath";
import Homepage from "~/pages/Dashboard/Homepage";
import Supplier from "~/pages/Dashboard/Supplier";
import ProductGroupPage from "~/pages/Dashboard/ProductGroup";
import ManufacturerPage from "~/pages/Dashboard/Manufacturer";
import RankingManufacturerPage from "~/pages/Dashboard/RankingManufacturer";
import Branch from "~/pages/Dashboard/Branch";
import StatusConfig from "~/pages/Dashboard/StatusConfig";
import EmployeePage from "~/pages/Dashboard/Employee";
import UserPage from "~/pages/Dashboard/User";
import UserGroupPage from "~/pages/Dashboard/UserGroup";
import Unit from "~/pages/Dashboard/Unit";
import MedicinePage from "~/pages/Dashboard/Medicine";
import WorkBoardPage from "~/pages/Dashboard/WorkBoard";
// import WorkSprintPage from "~/pages/Dashboard/WorkSprint";
export const mainRoutes :PathRouteProps[] = [
  { path: PATH_APP.main.root, Component: Homepage },
  { path: PATH_APP.supplier.root, Component: Supplier },
  { path: PATH_APP.worldPharma.productGroup, Component: ProductGroupPage },
  { path: PATH_APP.worldPharma.manufacturer, Component: ManufacturerPage },
  { path: PATH_APP.worldPharma.ranking, Component: RankingManufacturerPage },
  { path: PATH_APP.worldPharma.unit, Component:Unit  },
  { path: PATH_APP.worldPharma.medicine, Component:MedicinePage  },
  { path: PATH_APP.branch.root, Component: Branch },
  { path: PATH_APP.todoList.statusConfig, Component: StatusConfig },
  { path: PATH_APP.todoList.workBoard, Component: WorkBoardPage },
  { path: PATH_APP.employee.root, Component: EmployeePage },
  { path: PATH_APP.user.root, Component: UserPage },
  { path: '/', Component: Homepage },
]

export const authRoutes : PathRouteProps[] = [
    { path: '/login', Component: Auth.page.login },
  ];

