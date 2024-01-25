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
import ProductPage from "~/pages/Dashboard/Product";
import ConfigDiscountPage from "~/pages/Dashboard/ConfigDiscount";
import Pharmacy from "~/pages/Dashboard/Pharmacy";
import Bill from "~/pages/Dashboard/Bill";
import UpdateBill from "~/pages/Dashboard/Bill/UpdateBill";
import Quotation from "~/pages/Dashboard/Quotation";
import WorkBoardPage from "~/pages/Dashboard/WorkBoard";
import WorkSprintPage from "~/pages/Dashboard/WorkSprint";
import WorkListPage from "~/pages/Dashboard/WorkList";
import WorkTaskPage from "~/pages/Dashboard/WorkTask";
export const mainRoutes :PathRouteProps[] = [
  { path: PATH_APP.main.root, Component: Homepage },

  // Supplier
  { path: PATH_APP.supplier.root, Component: Supplier },

  // worldPharma
  { path: PATH_APP.worldPharma.productGroup, Component: ProductGroupPage },
  { path: PATH_APP.worldPharma.manufacturer, Component: ManufacturerPage },
  { path: PATH_APP.worldPharma.ranking, Component: RankingManufacturerPage },
  { path: PATH_APP.worldPharma.unit, Component:Unit  },
  { path: PATH_APP.worldPharma.medicine, Component:MedicinePage  },

  // Branch
  { path: PATH_APP.branch.root, Component: Branch },

  // Product
  { path: PATH_APP.product.edit, Component: ProductPage },

  // Bill
  { path: PATH_APP.bill.root, Component: Bill },
  { path: PATH_APP.bill.update, Component: UpdateBill },
  { path: PATH_APP.quotation.root, Component: Quotation },

  // TodoList
  { path: PATH_APP.todoList.statusConfig, Component: StatusConfig },

  // Employee
  { path: PATH_APP.todoList.workBoard, Component: WorkBoardPage },
  { path: PATH_APP.employee.root, Component: EmployeePage },

  // User
  { path: PATH_APP.user.root, Component: UserPage },

  //ConfigDiscount
  { path: PATH_APP.configDiscount.root, Component: ConfigDiscountPage },

  // Pharmacy
  { path: PATH_APP.pharmacy.root, Component: Pharmacy },

  // Bot Notification
  { path: PATH_APP.botNotification.root, Component: null },
 
  //Work Management
  { path: PATH_APP.todoList.workSprint, Component: WorkSprintPage },
  { path: PATH_APP.todoList.workList, Component: WorkListPage },
  { path: PATH_APP.todoList.workTask, Component: WorkTaskPage },

  { path: '/', Component: Homepage },
]

export const authRoutes : PathRouteProps[] = [
    { path: '/login', Component: Auth.page.login },
  ];

