import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import{omit} from 'lodash'
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  confirmSuccess?: any,
  confirmFailed?: any
};
class ReceiptVoucherClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('receiptVoucher');
    this.cloneReducer = {
      ...this.initReducer,
      confirmReceiptVoucherRequest: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = true;
      },
      confirmReceiptVoucherSuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.confirmSuccess = payload;
        state.list = state.list?.map((item: any) => {
          if (item._id === payload?.data?._id) {
            return { ...item, ...payload?.data };
          }
          return item
        });
      },
      confirmReceiptVoucherFailed: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.confirmFailed = payload;
      },

      updateSuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.list = state.list?.map((item: any) => {
          if (item._id === payload?.data?._id) {
            return {...item, ...payload?.data};
          }
          return item
        });
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

const newSlice = new ReceiptVoucherClassExtend();
const data = newSlice.createSlice();


export const receiptVoucherSliceAction = data.actions;
export default data.reducer;
