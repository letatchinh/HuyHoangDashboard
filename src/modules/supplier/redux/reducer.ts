import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { getPaging } from "~/utils/helpers";
import { cloneInitState } from "../supplier.modal";

class SupplierClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState: cloneInitState;
  constructor() {
    super("supplier");
    this.clone = {
      ...this.initReducer,
      // Add More Reducer
      getProductSupplierRequest: (state: any) => {
        state.isLoadingGetProductSupplier = true;
        state.getProductSupplierFailed = null;
        state.totalAmountBillItem = 0;
      },
      getProductSupplierSuccess: (state: any, { payload }: any) => {
        state.isLoadingGetProductSupplier = false;
        state.productSupplier = get(payload, "docs", []);
        state.pagingProductSupplier = getPaging(payload);
        state.totalAmountBillItem = get(payload, "totalAmountBillItem", 0);
      },
      getProductSupplierFailed: (state: any, { payload }: any) => {
        state.isLoadingGetProductSupplier = false;
        state.getProductSupplierFailed = payload;
        state.totalAmountBillItem = 0;
      },
      getVoucherSupplierRequest: (state: any) => {
        state.isLoadingGetVoucherSupplier = true;
        state.getVoucherSupplierFailed = null;
      },
      getVoucherSupplierSuccess: (state: any, { payload }: any) => {
        state.isLoadingGetVoucherSupplier = false;
        state.voucherSupplier = get(payload, "docs", []);
        state.pagingVoucherSupplier = getPaging(payload);
      },
      getVoucherSupplierFailed: (state: any, { payload }: any) => {
        state.isLoadingGetVoucherSupplier = false;
        state.getVoucherSupplierFailed = payload;
      },
    };
    // Add More InitState
    this.cloneInitState = {
      ...this.initialState,
      isLoadingGetProductSupplier: false,
      getProductSupplierFailed: null,
      productSupplier: [],
      pagingProductSupplier: null,
    };
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers: this.clone,
    });
  }
}

const newSlice = new SupplierClassExtend();
const data = newSlice.createSlice();


export const supplierSliceAction   = data.actions;
export default data.reducer;
