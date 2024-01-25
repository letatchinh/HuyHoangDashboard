import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import{omit} from 'lodash'

interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  confirmSuccess?: any,
  confirmFailed?: any
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
        state.confirmSuccess = payload;
      },
      confirmPaymentVoucherFailed: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.confirmFailed = payload;
      },
      resetAction: (state:cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, ["list"]),
      }),
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      confirmSuccess:  undefined,
      confirmFailed: undefined,
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
