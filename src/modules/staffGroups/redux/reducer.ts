import { createSlice } from "@reduxjs/toolkit";
import { omit } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  isLoadingRoleUser?: boolean;
  byIdRoleUser?: any;
  getByIdRoleUserFailed?: any;

  updateRoleUserSuccess?: any;
  updateRoleUserFailed?: any;

  removeRoleUserSuccess?: any;
  removeRoleUserFailed?: any;
}
class StaffGroupsClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('staffGroups');
    this.cloneReducer = {
      ...this.initReducer,
      // Want Add more reducer Here...

      getRoleByUserRequest: (state: cloneInitState, { payload }: any) => {
        state.isLoadingRoleUser = true;
        state.getByIdRoleUserFailed = null;
      },

      getRoleByUserSuccess: (state:cloneInitState , { payload }: any) => {
        state.isLoadingRoleUser = false;
        state.byIdRoleUser = payload;
      },
      getRoleByUserFailed: (state:cloneInitState , { payload }: any) => {
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
        state.byIdRoleUser = [...state.byIdRoleUser,payload];
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
      resetActionUpdateRole: (state:cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, ["list",'paging','byId','byIdRoleUser']),
      }),
    }
    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...

      isLoadingRoleUser: false,
      byIdRoleUser: null,
      getByIdRoleUserFailed: null,

      updateRoleUserSuccess: null,
      updateRoleUserFailed: null,

      removeRoleUserSuccess: null,
      removeRoleUserFailed: null

    }
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers:  this.cloneReducer,
    });
  }
  
}

const newSlice = new StaffGroupsClassExtend();
const data = newSlice.createSlice();


export const staffGroupsActions = data.actions;
export default data.reducer;
