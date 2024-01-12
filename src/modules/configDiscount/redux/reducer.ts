import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  updateListSuccess?: boolean | undefined;
  updateListFailed?: any;
};
class ConfigDiscountClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('configDiscount');
    this.cloneReducer = {
      ...this.initReducer,
      getListSuccess: (state: cloneInitState, { payload }: any) => {
        state.isLoading = false;
        state.list = payload?.config;
      },
      updateListRequest: (state: cloneInitState, { payload }: any) => {
        state.isLoading = true;
        state.updateListSuccess = undefined;
      },
      updateListSuccess: (state: cloneInitState, { payload }: any) => {
        state.isLoading = false;
        state.updateListSuccess = payload;
      },
      updateListFailed: (state: cloneInitState, { payload }: any) => {
        state.isLoading = false;
        state.updateListFailed = payload;
      },
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      updateListSuccess:  undefined,
      updateListFailed: false,
      // Want Add more State Here...
    }
  }
  createSlice(): any {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers:  this.cloneReducer,
    });
  };
};

const newSlice = new ConfigDiscountClassExtend();
const data = newSlice.createSlice();


export const configDiscountSliceAction = data.actions;
export default data.reducer;