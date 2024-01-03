import { createSlice } from '@reduxjs/toolkit';
import { get } from 'lodash';
import { removeAxiosToken, setAxiosCompanyId, setAxiosToken } from '~/api/requester';
const initialState : any = {
    isLoading: false,

    token: null,
    loginFailed: null,

    profile: null,
    isGetProfileLoading: false,
    getProfileFailed: null,

    updateWorkingTimeFailed: null,
    updateWorkingTimeSuccess: null,
    isUpdateWorkingTimeLoading: false,
}

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        // LOGIN
        loginRequest: (state, { payload } : any) => {
            state.isLoading = true;
            state.token = null;
            state.loginFailed = null;
        },
        loginSuccess: (state, { payload } : any) => {
            state.token = payload.token;
            setAxiosToken(payload.token);
            setAxiosCompanyId(payload.branchId)
            state.isLoading = false;
        },
        loginFailed: (state, { payload }  : any) => {
            state.loginFailed = payload;
            state.isLoading = false;
        },
        logoutRequest: async() => {
            removeAxiosToken();
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


}})

// Action creators are generated for each case reducer function
export const authActions = auth.actions

export default auth.reducer