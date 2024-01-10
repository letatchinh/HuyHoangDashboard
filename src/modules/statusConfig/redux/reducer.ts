import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { getPaging } from "~/utils/helpers";
import { cloneInitState } from "../statusConfig.modal";

class StatusConfigClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState:cloneInitState;
  constructor() {
    super("statusConfig");
    this.clone = {
      ...this.initReducer,
      // Add More Reducer
      getStatusConfigRequest: (state: any) => {
        state.isLoadingGetStatusConfig = true;
        state.getStatusConfigFailed = null;
      },
      getStatusConfigSuccess: (state: any, { payload }: any) => {
        state.isLoadingGetStatusConfig = false;
        state.statusConfig = payload;
        state.pagingStatusConfig = getPaging(payload);
      },
      getStatusConfigFailed: (state: any, { payload }: any) => {
        state.isLoadingGetStatusConfig = false;
        state.getStatusConfigFailed = payload;
      },
    };
    // Add More InitState
    this.cloneInitState = {
      ...this.initialState,
      isLoadingGetStatusConfig: false,
      getStatusConfigFailed: null,
      statusConfig: [],
      pagingStatusConfig: null,
    };
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers:  this.clone,
    });
  }
  
}

const statusConfigSlice = new StatusConfigClassExtend();
const data = statusConfigSlice.createSlice();


export const statusConfigActions = data.actions;
export default data.reducer;