import { PathRouteProps, Route, Routes } from "react-router-dom";
import { setAxiosCompanyId, setAxiosToken, setupAxios } from "./api/requester";

import { authRoutes, mainRoutes } from "./routes/allRoute";
import ProtectRoute from "./routes/middleware/ProtectRoute";
import AuthModule from "~/modules/auth";

function App(): React.JSX.Element {
  setupAxios();
  const token = AuthModule.hook.useToken();
  setAxiosToken(token);
  setAxiosCompanyId('99999'); // Fix Me , Just Init Project
  return (
    <Routes>
      {authRoutes.map((route: PathRouteProps) => (
        <Route key={route.path} {...route} />
      ))}

      <Route path="/" element={<ProtectRoute />}>
        {mainRoutes.map((route: PathRouteProps) => (
          <Route key={route.path} {...route} />
        ))}
      </Route>
    </Routes>
  );
}

export default App;
