import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
}
class PaymentVoucherClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('paymentVoucher');
    this.cloneReducer = {
      ...this.initReducer,
      confirmPaymentVoucherRequest: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = true;
      },
      confirmPaymentVoucherSuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.updateSuccess = payload;
      },
      confirmPaymentVoucherFailed: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.updateFailed = payload;
      },
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
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

const newSlice = new PaymentVoucherClassExtend();
const data = newSlice.createSlice();


export const paymentVoucherSliceAction = data.actions;
export default data.reducer;
