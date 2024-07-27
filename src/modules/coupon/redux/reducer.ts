import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
  copySuccess? : any,
  copyFailed? : any
 // Add cloneInitState Type Here
}
class CouponClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('coupon');
    this.cloneReducer = {
      ...this.initReducer,
      copyRequest: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = true;
        state.copyFailed = null;
       },
      copySuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.copySuccess = payload;
       },
      copyFailed: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.copyFailed = payload;
       },
      
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      copySuccess : null,
      copyFailed : null,
      // Want Add more State Here...
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

const newSlice = new CouponClassExtend();
const data = newSlice.createSlice();


export const couponActions = data.actions;
export default data.reducer;
