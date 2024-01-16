import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { cloneInitState } from "../workList.modal";

class WorkListClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState: cloneInitState;

  constructor() {
    super('workList');
    this.cloneReducer = {
      ...this.initReducer,
      getListBoardConfigRequest: (state: cloneInitState) => {
        state.isLoadingListWorkConfig = true;
        state.getListWorkConfigFailed = null;
      },
      getListBoardConfigSuccess: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingListWorkConfig = false;
        state.listWorkConfig = payload;
        state.getListWorkConfigFailed = null;
      },
      getListBoardConfigFailed: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.isLoadingListWorkConfig = false;
        state.getListWorkConfigFailed = payload;
      },
      // Want to add more reducers here...
    };

    this.cloneInitState = {
      ...this.initialState,
      isLoadingListWorkConfig: false,
      getListWorkConfigFailed: null,
      listWorkConfig: [],
      
      // Want to add more state here...
    };
  }

  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers: this.cloneReducer,
    });
  }
}

const newSliceWorkList = new WorkListClassExtend();
const dataWorkList = newSliceWorkList.createSlice();

export const workListActions = dataWorkList.actions;
export default dataWorkList.reducer;
