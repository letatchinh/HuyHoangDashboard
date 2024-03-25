import { PathRouteProps, Route, Routes } from "react-router-dom";
import { setAxiosCompanyId, setAxiosToken, setupAxios } from "./api/requester";

import { authRoutes, mainRoutes } from "./routes/allRoute";
import ProtectRoute from "./routes/middleware/ProtectRoute";
import AuthModule from "~/modules/auth";
import { PATH_APP } from "./routes/allPath";
import BillModule from "~/modules/sale/bill";
import CreateBillPage from "./pages/Dashboard/Bill/CreateBill";
import packageJson from "../package.json";
import CreateOrderSupplier from "./pages/Dashboard/OrderSupplier/CreateOrderSupplier";
import { useUserPolicy } from "./modules/policy/policy.hook";

function App(): React.JSX.Element {
  setupAxios();
  const token = AuthModule.hook.useToken();
  setAxiosToken(token);
  setAxiosCompanyId("99999"); // Fix Me , Just Init Project
  useUserPolicy(); // Get Policies

  return (
    <>
      <Routes>
        {authRoutes.map((route: PathRouteProps) => (
          <Route key={route.path} {...route} />
        ))}

          
        <Route path="/" element={<ProtectRoute />}>
          {mainRoutes.map((route: PathRouteProps) => (
            <Route key={route.path} {...route} />
          ))}
        </Route>
        <Route
          key={PATH_APP.bill.create}
          path={PATH_APP.bill.create}
          Component={() => <CreateBillPage />}
        />
        <Route
          key={PATH_APP.orderSupplier.create}
          path={PATH_APP.orderSupplier.create}
          Component={() => <CreateOrderSupplier />}
        />
      </Routes>
      <div
        style={{
          position: "fixed",
          bottom: "16px",
          right: 0,
          width: "max-content",
        }}
      >
        <p
          style={{
            textAlign: "right",
            marginRight: "16px",
            color: "rgba(0, 0, 0, 0.1)",
          }}
        >
          Version: {packageJson.version}
        </p>
      </div>
    </>
  );
}

export default App;
