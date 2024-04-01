import { get } from "lodash";
import { useCallback } from "react";
import { useSelector } from "react-redux";
import { useFailed, useFetchByParam, useSubmit, useSuccess } from "~/utils/hook";
import { authActions } from "./redux/reducer";

const getSelector = (key : any) => (state : any) => state.auth[key];
const tokenSelector = getSelector('token');
const adapterSelector = getSelector('adapter');
const isLoadingSelector = getSelector('isLoading');
const profileSelector = getSelector('profile');
const loginFailedSelector = getSelector('loginFailed');
const getProfileFailedSelector = getSelector('getProfileFailed');
const isGetProfileLoadingFailedSelector = getSelector('isGetProfileLoading');
export const useLogin = (callback? : any) => {
    useSuccess(tokenSelector,'',callback);
    useFailed(loginFailedSelector,"Sai tài khoản hoặc mật khẩu");
    return useSubmit({
        loadingSelector : isLoadingSelector,
        action : authActions.loginRequest,
        
    })
};
export function useLogout () : [boolean, () => void] {
    const [isLoading,onLogout] : any =  useSubmit({
        loadingSelector : isLoadingSelector,
        action : authActions.logoutRequest,
    });

    const logout = useCallback(()  => {
        onLogout();
    },[onLogout]);
    return [isLoading,logout]
};


export const useToken = () => {
    const token = useSelector(tokenSelector);
    return token
};
export const useAdapter = () => {
    const adapter = useSelector(adapterSelector);
    return adapter
};

// Get New Profile from Sever
export const useProfile = () => {
    const token = useSelector(tokenSelector);    
    return useFetchByParam({
        action : authActions.getProfileRequest,
        dataSelector : profileSelector,
        failedSelector : getProfileFailedSelector,
        loadingSelector : isGetProfileLoadingFailedSelector,
        param : token,
    })
}

// Get Profile From redux
export const useGetProfile = () => {
    const profile = useSelector(profileSelector);
    return profile
}

export const useIsSuperAdmin = () : boolean => {
    const profile = useSelector(profileSelector);
    return get(profile,'user.isSuperAdmin')
}