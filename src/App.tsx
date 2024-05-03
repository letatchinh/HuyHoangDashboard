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
import { useEffect, useState } from "react";
import { onMessageListener} from "./modules/notification/firebase";

function App(): React.JSX.Element {
  const width = window.innerWidth;
  setupAxios();
  const token = AuthModule.hook.useToken();
  setAxiosToken(token);
  setAxiosCompanyId("99999"); // Fix Me , Just Init Project

  const device = DeviceDetector();
  // useUserPolicy(); // Get Policies
  const [foregroundMessage, setForegroundMessage] = useState(null);
  // useEffect(() => {
  //   const handleForegroundMessage = (payload: any) => {
  //     console.log('Received foreground message:', payload);
  //     const { notification: { title, body } } = payload;
  //     alert('Received foreground message:');
  //     setForegroundMessage(payload); // Update state with new foreground message
  //   };

  //   const fetchForegroundMessage = async () => {
  //     console.log('fetchForegroundMessage')
  //     try {
  //       const payload = await onForegroundMessage();
  //       // const payload = await onMessageListener();
  //       handleForegroundMessage(payload);
  //     } catch (err) {
  //       console.error('An error occurred while retrieving foreground message:', err);
  //     }
  //   };

  //   fetchForegroundMessage();

  // }, [foregroundMessage]); 
  
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
          key={PATH_APP.orderSupplier.create}
          path={PATH_APP.orderSupplier.create}
          Component={() =>  <CreateOrderSupplier />}
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
