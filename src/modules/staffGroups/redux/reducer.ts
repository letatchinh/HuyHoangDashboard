import { createSlice } from "@reduxjs/toolkit";
import { omit } from "lodash";
import { InitState, InstanceModuleRedux } from "~/redux/instanceModuleRedux";
interface cloneInitState extends InitState {
  isLoadingRoleUser?: boolean;
  byIdRoleUser?: any;
  getByIdRoleUserFailed?: any;

  updateRoleUserSuccess?: any;
  updateRoleUserFailed?: any;

  removeRoleUserSuccess?: any;
  removeRoleUserFailed?: any;
}

const cloneInitState = {
  ...InstanceModuleRedux.initialState,
  isLoadingRoleUser: false,
  byIdRoleUser: null,
  getByIdRoleUserFailed: null,

  updateRoleUserSuccess: null,
  updateRoleUserFailed: null,

  removeRoleUserSuccess: null,
  removeRoleUserFailed: null
} as cloneInitState

const data = createSlice({
  name: 'staffGroups',
  initialState: cloneInitState,
  reducers: {
    ...InstanceModuleRedux.initReducer,

    getRoleByUserRequest: (state: cloneInitState, { payload }: any) => {
      state.isLoadingRoleUser = true;
      state.getByIdRoleUserFailed = null;
    },

    getRoleByUserSuccess: (state: cloneInitState, { payload }: any) => {
      state.isLoadingRoleUser = false;
      state.byIdRoleUser = payload;
    },
    getRoleByUserFailed: (state: cloneInitState, { payload }: any) => {
      state.isLoadingRoleUser = false;
      state.getByIdRoleUserFailed = payload;
    },
    updateRoleUserRequest: (state: cloneInitState, { payload }: any) => {
      state.isLoadingRoleUser = true;
      state.updateRoleUserFailed = null;
    },

    updateRoleUserSuccess: (state: cloneInitState, { payload }: any) => {
      state.isLoadingRoleUser = false;
      state.updateRoleUserSuccess = payload;
      state.byIdRoleUser = [...state.byIdRoleUser, payload];
    },
    updateRoleUserFailed: (state: cloneInitState, { payload }: any) => {
      state.isLoadingRoleUser = false;
      state.updateRoleUserFailed = payload;
    },

    removeRoleUserRequest: (state: cloneInitState, { payload }: any) => {
      state.isLoadingRoleUser = true;
      state.removeRoleUserFailed = null;
    },

    removeRoleUserSuccess: (state: cloneInitState, { payload }: any) => {
      state.isLoadingRoleUser = false;
      state.removeRoleUserSuccess = payload;
      state.byIdRoleUser = state.byIdRoleUser.filter((item: any) => item._id !== payload._id);
    },
    removeRoleUserFailed: (state: cloneInitState, { payload }: any) => {
      state.isLoadingRoleUser = false;
      state.removeRoleUserFailed = payload;
    },
    resetActionUpdateRole: (state: cloneInitState) => ({
      ...state,
      ...omit(cloneInitState, ["list", 'paging', 'byId', 'byIdRoleUser']),
    }),
  }
})

export const staffGroupsActions = data.actions
export default data.reducer




