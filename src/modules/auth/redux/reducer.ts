import { createSlice } from '@reduxjs/toolkit';
import { get } from 'lodash';
import { removeAxiosToken, setAxiosCompanyId, setAxiosToken } from '~/api/requester';
import { subscribeToken, unSubscribeToken } from '~/modules/user/user.hook';
const initialState : any = {
    isLoading: false,

    token: undefined,
    adapter: null,
    loginFailed: null,

    profile: null,
    isGetProfileLoading: false,
    getProfileFailed: null,

    updateWorkingTimeFailed: null,
    updateWorkingTimeSuccess: null,
    isUpdateWorkingTimeLoading: false,

    isValidationTokenSuccess: null,
    validationTokenFailed: null,
}

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // LOGIN
        loginRequest: (state, { payload } : any) => {
            state.isLoading = true;
            state.token = undefined;
            state.loginFailed = null;
            state.adapter = null;
        },
        loginSuccess: (state, action: { payload: { token: any; branchId: any,adapter? : any } }) => {
            const { token, branchId,adapter } = action.payload;
            state.token = token;
            state.adapter = adapter;
            setAxiosToken(token);
            setAxiosCompanyId(branchId); // Assuming branchId is the correct property name
            state.isLoading = false;
            setTimeout(() => {
                window.location.reload();
            }, 100);
          },
        loginFailed: (state, { payload }  : any) => {
            state.loginFailed = payload;
            state.isLoading = false;
        },
        logoutRequest: async(_,{ payload } ) => {
            // unSubscribeToken();
            removeAxiosToken();
            let { callbackSubmit } = payload
            callbackSubmit&& callbackSubmit()
            return initialState
        },

        // GET PROFILE

        getProfileRequest: (state) => {
            state.isGetProfileLoading = true;
            state.getProfileFailed = null;
        },
        getProfileSuccess: (state, { payload } : any,) => {
            state.isGetProfileLoading = false;
            state.profile = payload;
        },
        getProfileFailed: (state, { payload } : any) => {
            state.isGetProfileLoading = false;
            state.getProfileFailed = payload;
        },

        validationTokenRequest: (state,{payload}) => {
            state.validationTokenFailed = null;
            state.validationTokenSuccess = null;
        },
        validationTokenSuccess: (state, { payload } : any,) => {
            state.validationTokenSuccess = payload;
        },
        validationTokenFailed: (state, { payload } : any) => {
            state.validationTokenFailed = payload;
        },


}})

// Action creators are generated for each case reducer function
export const authActions = auth.actions

export default auth.reducer
