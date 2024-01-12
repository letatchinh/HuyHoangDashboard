import Auth from "~/modules/auth";
import { PathRouteProps } from 'react-router-dom';
import { PATH_APP } from "./allPath";
import Homepage from "~/pages/Dashboard/Homepage";
import Supplier from "~/pages/Dashboard/Supplier";
import ProductConfigPage from "~/pages/Dashboard/ProductConfig";
import ManufacturerPage from "~/pages/Dashboard/Manufacturer";
import RankingManufacturerPage from "~/pages/Dashboard/RankingManufacturer";
import Branch from "~/pages/Dashboard/Branch";
import Unit from "~/pages/Dashboard/Unit";
import MedicinePage from "~/pages/Dashboard/Medicine";
import ProductPage from "~/pages/Dashboard/Product";
import Pharmacy from "~/pages/Dashboard/Pharmacy";
export const mainRoutes :PathRouteProps[] = [
  { path: PATH_APP.main.root, Component: Homepage },
  { path: PATH_APP.supplier.root, Component: Supplier },
  { path: PATH_APP.worldPharma.productConfig, Component: ProductConfigPage },
  { path: PATH_APP.worldPharma.manufacturer, Component: ManufacturerPage },
  { path: PATH_APP.worldPharma.ranking, Component: RankingManufacturerPage },
  { path: PATH_APP.worldPharma.unit, Component:Unit  },
  { path: PATH_APP.worldPharma.medicine, Component:MedicinePage  },
  { path: PATH_APP.branch.root, Component: Branch },
  { path: PATH_APP.product.edit, Component: ProductPage },
  { path: PATH_APP.pharmacy.root, Component: Pharmacy },

  { path: '/', Component: Homepage },
]

export const authRoutes : PathRouteProps[] = [
    { path: '/login', Component: Auth.page.login },
  ];

