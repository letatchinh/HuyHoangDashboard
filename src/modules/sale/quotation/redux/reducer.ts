import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
export interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  convertFailed?: any;
  convertSuccess?: any;

  checkBillFailed?: any;
  checkBillSuccess?: any;

  copyFailed?: any;
  copySuccess?: any;
}
class QuotationClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState: cloneInitState;
  constructor() {
    super("quotation");
    this.cloneReducer = {
      ...this.initReducer,
      // convert
      convertRequest: (state: cloneInitState) => {
        state.isSubmitLoading = true;
        state.convertFailed = null;
      },
      convertSuccess: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.convertSuccess = payload;
      },
      convertFailed: (state: cloneInitState, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.convertFailed = payload;
      },

      copyRequest: (state: cloneInitState) => {
        state.isSubmitLoading = true;
        state.copyFailed = null;
      },
      copySuccess: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.copySuccess = payload;
      },
      copyFailed: (state: cloneInitState, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.copyFailed = payload;
      },

      checkBillRequest: (state: cloneInitState) => {
        state.isSubmitLoading = true;
        state.checkBillFailed = null;
      },
      checkBillSuccess: (state: cloneInitState,{ payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.checkBillSuccess = payload;
      },
      checkBillFailed: (state: cloneInitState, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.checkBillFailed = payload;
      },

      reset: () => this.cloneInitState,
    };
    this.cloneInitState = {
      ...this.initialState,
      convertFailed: null,
      convertSuccess: null,
      copyFailed: null,
      copySuccess: null,
      
      checkBillFailed: null,
      checkBillSuccess: null,

      // Want Add more State Here...
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

const newSlice = new QuotationClassExtend();
const data = newSlice.createSlice();

export const quotationActions = data.actions;
export default data.reducer;
