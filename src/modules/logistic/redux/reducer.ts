import { createSlice } from "@reduxjs/toolkit";
import { count } from "console";
import { omit } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  fee?: number | null ;
}
class LogisticClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('logistic');
    this.cloneReducer = {
      ...this.initReducer,
      // Want Add more reducer Here...
      countFeeRequest: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = true;
      },
      countFeeSuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.fee = payload;
      },
      countFeeFailed: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
      },
      resetAction: (state: cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, [])
      })
    }
    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...
      fee: null,
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

const newSlice = new LogisticClassExtend();
const data = newSlice.createSlice();


export const logisticActions = data.actions;
export default data.reducer;
