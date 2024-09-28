// import { createSlice } from "@reduxjs/toolkit";
// import { removeAxiosToken, setAxiosCompanyId, setAxiosToken } from "~/api/requester";
// import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
// import { initStateSlice } from "~/redux/models";
// interface cloneInitState extends initStateSlice {
//   // Add cloneInitState Type Here

//   token?: undefined,
//   adapter?: any,
//   loginFailed?: any,

//   profile?: any,
//   isGetProfileLoading?: boolean,
//   getProfileFailed?: any,

//   updateWorkingTimeFailed?: any,
//   updateWorkingTimeSuccess?: any,
//   isUpdateWorkingTimeLoading?: boolean,

//   isValidationTokenSuccess?: any,
//   validationTokenFailed?: any,
//   validationTokenSuccess?: any,

// };
// class AuthClassExtend extends InstanceModuleRedux {
//   cloneReducer;
//   cloneInitState : cloneInitState;
//   constructor() {
//     super('auth');
//     this.cloneReducer = {
//       ...this.initReducer,
//       loginRequest: (state : cloneInitState, { payload } : any) => {
//         state.isSubmitLoading = true;
//         state.token = undefined;
//         state.loginFailed = null;
//         state.adapter = null;
//     },
//     loginSuccess: (state : cloneInitState, action: { payload: { token: any; branchId: any,adapter? : any } }) => {
//         const { token, branchId,adapter } = action.payload;
//         state.token = token;
//         state.adapter = adapter;
//         setAxiosToken(token);
//         setAxiosCompanyId(branchId); // Assuming branchId is the correct property name
//         state.isSubmitLoading = false;
//         setTimeout(() => {
//             window.location.reload();
//         }, 100);
//       },
//       loginFailed: (state : cloneInitState, { payload }  : any) => {
//           state.loginFailed = payload;
//           state.isSubmitLoading = false;
//       },
//       logoutRequest: async(state : cloneInitState,{ payload } : any) => {
//           removeAxiosToken();
//           let { callbackSubmit } = payload
//           callbackSubmit&& callbackSubmit()
//           return this.cloneInitState
//       },

//       // GET PROFILE

//       getProfileRequest: (state : cloneInitState) => {
//           state.isGetProfileLoading = true;
//           state.getProfileFailed = null;
//       },
//       getProfileSuccess: (state : cloneInitState, { payload } : any,) => {
//           state.isGetProfileLoading = false;
//           state.profile = payload;
//       },
//       getProfileFailed: (state : cloneInitState, { payload } : any) => {
//           state.isGetProfileLoading = false;
//           state.getProfileFailed = payload;
//       },

//       validationTokenRequest: (state : cloneInitState,{payload}: any) => {
//           state.validationTokenFailed = null;
//           state.validationTokenSuccess = null;
//       },
//       validationTokenSuccess: (state : cloneInitState, { payload } : any,) => {
//           state.validationTokenSuccess = payload;
//       },
//       validationTokenFailed: (state : cloneInitState, { payload } : any) => {
//           state.validationTokenFailed = payload;
//       },
//       // Want Add more reducer Here...
//     }
//     this.cloneInitState = {
//       ...this.initialState,
//       // Want Add more State Here...
//       token: undefined,
//       adapter: null,
//       loginFailed: null,

//       profile: null,
//       isGetProfileLoading: false,
//       getProfileFailed: null,

//       updateWorkingTimeFailed: null,
//       updateWorkingTimeSuccess: null,
//       isUpdateWorkingTimeLoading: false,

//       isValidationTokenSuccess: null,
//       validationTokenFailed: null,
//       validationTokenSuccess: null,
//     }
//   }
//   createSlice() {
//     return createSlice({
//       name: this.module,
//       initialState: this.cloneInitState,
//       reducers:  this.cloneReducer,
//     });
//   }
  
// }

// const newSlice = new AuthClassExtend();
// const data = newSlice.createSlice();


// export const authActions = data.actions;
// export default data.reducer;

import { createSlice } from '@reduxjs/toolkit';
import { removeAxiosToken, setAxiosCompanyId, setAxiosToken } from '~/api/requester';
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
        loginSuccess: (state, action: { payload: { token: any} }) => {
            const { token } = action.payload;
            state.token = token;
            // state.adapter = adapter;
            setAxiosToken(token);
            // setAxiosCompanyId(branchId); // Assuming branchId is the correct property name
            state.isLoading = false;
          },
        loginFailed: (state, { payload }  : any) => {
            state.loginFailed = payload;
            state.isLoading = false;
        },
        logoutRequest: async(_,{ payload } ) => {
            removeAxiosToken();
            let { callbackSubmit } = payload;
            callbackSubmit && callbackSubmit();
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
