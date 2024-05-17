import { get } from "lodash";
import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { UserResponseOne } from "../user.modal";
import { createSlice } from "@reduxjs/toolkit";
import { getPaging } from "~/utils/helpers";
import { subscribeToken } from "../user.hook";

interface UserState extends initStateSlice{
  policy?: {},
  isGetPolicyLoading?: boolean,
  getPolicyFailed?: any,

  profile?: {},
  isGetProfileLoading?: boolean,
  getProfileFailed?: any,

  isSubmitUpdateProfileLoading?: boolean,
  updateProfileSuccess?: any,
  updateProfileFailed?: any,

  tokenFcm?: any
};
class UserClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState;
  constructor() {
    super('user');
    this.clone = {
      ...this.initReducer,
      getListSuccess: (state: UserState, { payload }: { payload?: PaginateResult<UserResponseOne> }) => {
        state.isLoading = false;
        state.list = get(payload, 'docs', []);
        state.paging = getPaging(payload);
      },
      getPolicyRequest: (state: UserState, { payload }: any) => {
        state.policy = {};
        state.isGetPolicyLoading = true;
      },
      getPolicySuccess: (state: UserState, { payload }: any) => {
        state.isGetPolicyLoading = false;
        state.policy = payload;
      },
      getPolicyFailed: (state: UserState, { payload }: any) => {
        state.isGetPolicyLoading = false;
        state.getPolicyFailed = payload
      },

      getProfileRequest: (state: UserState) => {
        state.profile = {};
        state.isGetProfileLoading = true;
      },
      getProfileSuccess: (state: UserState, { payload }: any) => {
        state.isGetProfileLoading = false;
        state.profile = payload;
      },
      getProfileFailed: (state: UserState, { payload }: any) => {
        state.isGetProfileLoading = false;
        state.getProfileFailed = payload
      },

      updateProfileRequest: (state: UserState, { payload }: any) => {
        state.updateProfileSuccess = undefined;
        state.isSubmitUpdateProfileLoading = true;
        state.updateProfileFailed = undefined;
      },
      updateProfileSuccess: (state: UserState, { payload }: any) => {
        state.isSubmitUpdateProfileLoading = false;
        state.updateProfileSuccess = payload
      },
      updateProfileFailed: (state: UserState, { payload }: any) => {
        state.isSubmitUpdateProfileLoading = false;
        state.updateProfileFailed = payload;
      },
      subscribeFcmFirebaseRequest: (state: UserState) => {
        state.tokenFcm = undefined;
      },
      subscribeFcmFirebaseSuccess : (state: UserState, { payload }: any) => {
        state.tokenFcm = payload;
        subscribeToken(payload);
      },
    };
    this.cloneInitState = {
      ...this.initialState,
      policy: {},
      isGetPolicyLoading: false,
      getPolicyFailed: false,

      profile: {},
      isGetProfileLoading: false,
      getProfileFailed: undefined,

      updateProfileSuccess: undefined,
      updateProfileFailed: undefined,
      isSubmitUpdateProfileLoading: false,
      tokenFcm: undefined,
      // Want Add more State Here...
    };
  };
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.initialState,
      reducers:  this.clone,
    });
  }
  
}

const newSlice = new UserClassExtend();
const data = newSlice.createSlice();


export const userSliceAction  = data.actions;
export default data.reducer;