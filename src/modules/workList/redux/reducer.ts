import { createSlice } from "@reduxjs/toolkit";
import { get, sortBy } from "lodash";
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
      addBoardConfigItemRequest: (state: cloneInitState, { payload }: { payload: {id:string,[key:string]:any } }) => {
        // if(!state.dataBoardConfig?.[payload.id]){
        //   const id :string = payload.id;
        //   Object.assign(state.dataBoardConfig,{[id]:[]})
        // }
        state.dataBoardConfig[payload.id] = []
      },
      addBoardConfigItemSuccess: (state: any, { payload }: { payload?: any }) => {
        state.dataBoardConfig[payload?.id] = sortBy(payload.data, [function (o) { return o.ordinal }]);
      },
      addBoardConfigItemFaled: (state: any, { payload }: { payload?: any }) => {
        state.dataBoardConfig[payload.id] = []
      },
      // Want to add more reducers here...
    };

    this.cloneInitState = {
      ...this.initialState,
      isLoadingListWorkConfig: false,
      getListWorkConfigFailed: null,
      listWorkConfig: [],
      dataBoardConfig:{}
      
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
