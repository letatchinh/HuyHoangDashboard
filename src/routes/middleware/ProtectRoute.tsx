import { Navigate, Outlet } from "react-router-dom";
import LayoutVertical from "~/components/Layout/LayoutVertical/index";
import AuthModule from "~/modules/auth";
import { PATH_APP } from "../allPath";
import AuthMiddleware from "./AuthMiddleware";
const ProtectRoute = () => {
  const token = AuthModule.hook.useToken();

  // If authorized, return an outlet that will render child elements
  // If not, return element that will navigate to login page
  return token ? (
    <AuthMiddleware Layout={LayoutVertical} isAuthProtected={true} >
      <Outlet />
    </AuthMiddleware>
  ) : (
    <Navigate to={PATH_APP.auth.login} replace />
  );
};

export default ProtectRoute;
