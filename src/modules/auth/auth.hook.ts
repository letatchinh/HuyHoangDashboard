// Please UnComment To use

import { get } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetch, useFetchByParam,
    useQueryParams,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { authActions } from "./redux/reducer";
const MODULE = "auth";
const MODULE_VI = "";

const {
  loadingSelector,
  listSelector,
  getListFailedSelector,
  getByIdLoadingSelector,
  getByIdSelector,
  getByIdFailedSelector,
  deleteSuccessSelector,
  deleteFailedSelector,
  isSubmitLoadingSelector,
  createSuccessSelector,
  createFailedSelector,
  updateSuccessSelector,
  updateFailedSelector,
  pagingSelector,
} = getSelectors(MODULE);

export const useAuthPaging = () => useSelector(pagingSelector);
const getSelector = (key: any) => (state: any) => state.auth[key];
const loginFailedSelector = getSelector("loginFailed");
const tokenSelector = getSelector("token");
const isLoadingSelector = getSelector("isLoading");
const profileSelector = getSelector("profile");
const getProfileFailedSelector = getSelector("getProfileFailed");
const isGetProfileLoadingFailedSelector = getSelector("isGetProfileLoadingFailed");

export const useToken = () => {
  const token = useSelector(tokenSelector);
  return token
};

export const useLogin = (callback? : any) => {
  useSuccess(tokenSelector,'',callback);
  useFailed(loginFailedSelector);
  return useSubmit({
      loadingSelector : isLoadingSelector,
      action : authActions.loginRequest,
  })
};

export function useLogout (callback:()=>void = ()=>{}) : [boolean, () => void] {
  const [isLoading,onLogout] : any =  useSubmit({
      loadingSelector : isLoadingSelector,
      action : authActions.logoutRequest,
      callbackSubmit:callback
  });

  const logout = useCallback(()  => {
      onLogout();
  },[onLogout]);
  return [isLoading,logout]
};

export const useProfile = () => {
  return useFetch({
      action : authActions.getProfileRequest,
      dataSelector : profileSelector,
      failedSelector : getProfileFailedSelector,
      loadingSelector : isGetProfileLoadingFailedSelector,
  })
}


export const useGetProfile = () => {
  const profile = useSelector(profileSelector);
  return profile
}