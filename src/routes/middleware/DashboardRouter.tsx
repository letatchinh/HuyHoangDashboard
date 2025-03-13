import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useToken } from "~/modules/auth";
import { AUTH, PATH_APP } from "../allPath";
import { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { authActions } from "../../modules/auth/redux/reducer";
type propsType = {};
export default function DashboardRouter(props: propsType): React.JSX.Element {
  const token = useToken();
  let refLogin = useRef(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    !refLogin.current &&
      (async () => {
        refLogin.current = true;
        try {
          // await apis.auth.validationToken();
          refLogin.current = true
        } catch (error) {
          dispatch(authActions.logoutRequest({callbackSubmit:()=>navigate(AUTH.login)}))
        }
      })();
  }, [token]);
  return <Outlet />;
}
