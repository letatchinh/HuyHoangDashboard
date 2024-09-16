import { PathRouteProps, Route, Routes } from "react-router-dom";
import { setupAxios } from "./api/requester";

import packageJson from "../package.json";
import { mainRoutes } from "./routes/allRoute";
import ProtectRoute from "./routes/middleware/ProtectRoute";

function App(): React.JSX.Element {
  setupAxios();
  
  return (
    <>
      <Routes>
        <Route path='' element={<ProtectRoute/>} >
            {mainRoutes.map((route: PathRouteProps) => (
              <Route key={route.path} {...route} />
            ))}
          </Route>
          
          
      </Routes>
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          width: "max-content",
          pointerEvents : 'none'
        }}
      >
        <p
          style={{
            textAlign: "right",
            marginLeft: "16px",
            color: "rgba(233, 233, 233, 0.2)",
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
