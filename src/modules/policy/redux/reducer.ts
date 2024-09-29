import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { resources } from "../policy.modal";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  userPolicy?: any;
  isGetResourcesLoading?: boolean;
  resources?: any;
  actions?: any;
  getResourcesFailed?: any;
}
class PolicyClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('policy');
    this.cloneReducer = {
      ...this.initReducer,
      // Want Add more reducer Here...
      getByUserLoginResourceRequest: (state:cloneInitState , { payload }: any) => {
        state.userPolicy = payload;
      },
      getByUserLoginResourceSuccess: (state:cloneInitState , { payload }: any) => {
        state.userPolicy = payload;
      },
      getByUserLoginResourceFailed: (state:cloneInitState , { payload }: any) => {
        state.userPolicy = null;
      },

      getResourcesRequest: (state: cloneInitState , { payload}: any) => {
        state.isGetResourcesLoading = true; 
      },
      getResourcesSuccess: (state: cloneInitState , { payload }: any) => {
        state.resources = payload.resources;
        state.isGetResourcesLoading = false;
        state.actions = payload.actions;
      },
      getResourcesFailed: (state: cloneInitState , { payload }: any) => {
        state.isGetResourcesLoading = false;
        state.resources = null;
        state.actions = null;
      },

      updateResourcesRequest: (state: cloneInitState , { payload}: any) => {
        state.isGetResourcesLoading = true; 
      },
      updateResourcesSuccess: (state: cloneInitState , { payload }: { payload: { actions: resources[], resources: resources[] } }) => {
        state.resources = payload.resources;
        state.isGetResourcesLoading = false;
        state.actions = payload.actions;
      },
      updateResourcesFailed: (state: cloneInitState , { payload}: any) => {
        state.isGetResourcesLoading = false;
        state.getResourcesFailed = payload;
      },
      updateResourceRedux: (state: cloneInitState, { payload }: any) => {
        state.resources = state.resources;
      },
    }
    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...
      userPolicy: null,
      isGetResourcesLoading: false,
      resources: null,
      actions: null,
      getResourcesFailed: null
    }
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers: this.cloneReducer,
    });
  }
  
}

const newSlice = new PolicyClassExtend();
const data = newSlice.createSlice();


export const policyActions = data.actions;
export default data.reducer;
