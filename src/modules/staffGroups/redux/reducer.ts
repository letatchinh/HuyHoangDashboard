import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  isLoadingRoleUser?: boolean;
  byIdRoleUser?: any;
  getByIdRoleUserFailed?: any;
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
    }
    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...

      isLoadingRoleUser: false,
      byIdRoleUser: null,
      getByIdRoleUserFailed: null,

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
