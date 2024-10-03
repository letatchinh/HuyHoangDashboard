import '~/core/pdfPreviewSetup';
import { PathRouteProps, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { setAxiosToken, setupAxios } from "./api/requester";

import packageJson from "../package.json";
import { authRoutes, mainRoutes } from "./routes/allRoute";
import ProtectRoute from "./routes/middleware/ProtectRoute";
import AuthModule from "~/modules/auth";
import DashboardRouter from "./routes/middleware/DashboardRouter";
import { useEffect, useMemo } from "react";
import { AUTH, PATH_APP } from "./routes/allPath";

function App(): React.JSX.Element {
  setupAxios();
  const token = AuthModule.hook.useToken();
  setupAxios();
  setAxiosToken(token);

  const {pathname} = useLocation();
  const navigate = useNavigate();
  const refPersist =useMemo(()=>JSON.parse(localStorage.getItem('persist:auth')??JSON.stringify({'token':'null'})),[pathname]);
  useEffect(() => {
      if (pathname !== AUTH.login && !refPersist?.token) navigate(AUTH.login);
  },[navigate, refPersist, pathname]);
  
   return (
    <>
      <Routes>
        {authRoutes.map((route: PathRouteProps) => (
          <Route key={route.path} {...route} />
        ))}
         <Route path="/" element={<DashboardRouter/>}>
          <Route path="" element={<ProtectRoute />}>
            {mainRoutes.map((route: PathRouteProps) => (
              <Route key={route.path} {...route} />
            ))}
          </Route>
        </Route>
      </Routes>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "max-content",
          pointerEvents: "none",
        }}
      >
        <p
          style={{
            textAlign: "right",
            marginLeft: "16px",
            color: "rgba(233, 233, 233, 0.2)",
            pointerEvents: "none",
          }}
        >
          Version: {packageJson.version}
        </p>
      </div>
    </>
  );
}

export default App;
