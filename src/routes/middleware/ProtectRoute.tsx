import { Outlet } from "react-router-dom";
import LayoutVertical from "~/components/Layout/LayoutVertical/index";
import AuthMiddleware from "./AuthMiddleware";
const ProtectRoute = () => {

  return <AuthMiddleware Layout={LayoutVertical} >
      <Outlet />
    </AuthMiddleware>
};

export default ProtectRoute;
