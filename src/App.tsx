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
import CreateBillPageInDevice from "./pages/Dashboard/Bill/CreateBill_InDevice";
import { DeviceDetector } from "./utils/helpers";
import { useUserPolicy } from "./modules/policy/policy.hook";
import Reflex from "./components/Layout/LayoutVertical/Reflex";
import NotFoundPage from "./pages/Auth/NotFoundPage";

function App(): React.JSX.Element {
  const width = window.innerWidth;
  setupAxios();
  const token = AuthModule.hook.useToken();
  setAxiosToken(token);
  setAxiosCompanyId("99999"); // Fix Me , Just Init Project

  const device = DeviceDetector();
  // useUserPolicy(); // Get Policies
  
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
        <Route path='*' element={<NotFoundPage />} />
        <Route
          key={PATH_APP.bill.create}
          path={PATH_APP.bill.create}
          Component={() =>  device?.isMobile !== true ? <CreateBillPage/> :  <CreateBillPageInDevice />}
        />
        <Route
          key={PATH_APP.bill.createEmployee}
          path={PATH_APP.bill.createEmployee}
          Component={() =>  device?.isMobile !== true ? <CreateBillPage/> :  <CreateBillPageInDevice />}
        />
        <Route
          key={PATH_APP.bill.createPharmacy}
          path={PATH_APP.bill.createPharmacy}
          Component={() =>  device?.isMobile !== true ? <CreateBillPage/> :  <CreateBillPageInDevice />}
        />
        <Route
          key={PATH_APP.bill.createCollaborator}
          path={PATH_APP.bill.createCollaborator}
          Component={() =>  device?.isMobile !== true ? <CreateBillPage/> :  <CreateBillPageInDevice />}
        />
        <Route
          key={PATH_APP.orderSupplier.create}
          path={PATH_APP.orderSupplier.create}
          Component={() =>  <CreateOrderSupplier />}
        />
      </Routes>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: "max-content",
          pointerEvents : 'none'
        }}
      >
        <p
          style={{
            textAlign: "right",
            marginRight: "16px",
            color: "rgba(0, 0, 0, 0.1)",
            pointerEvents : 'none'
          }}
        >
          Version: {packageJson.version}
        </p>
      </div>
    </>
  );
}

export default App;
