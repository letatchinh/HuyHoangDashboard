import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import AuthModule from "~/modules/auth";
import { PATH_APP } from "../allPath";
import { useEffect, useRef } from "react";
import apis from "../../api";
import { useDispatch } from "react-redux";
import { authActions } from "../../modules/auth/redux/reducer";
type propsType = {};
export default function DashboardRouter(props: propsType): React.JSX.Element {
  const token = AuthModule.hook.useToken();
  let refLogin = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    !refLogin.current &&
      (async () => {
        refLogin.current = true;
        try {
          await apis.auth.validationToken();
        } catch (error) {
          dispatch(authActions.logoutRequest({callbackSubmit:()=>navigate(PATH_APP.auth.login)}))
        }
      })();
  }, [token]);
  return <Outlet />;
}
