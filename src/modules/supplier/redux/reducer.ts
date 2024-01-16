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
      },
      getProductSupplierSuccess: (state: any, { payload }: any) => {
        state.isLoadingGetProductSupplier = false;
        state.productSupplier = get(payload, "docs", []);
        state.pagingProductSupplier = getPaging(payload);
      },
      getProductSupplierFailed: (state: any, { payload }: any) => {
        state.isLoadingGetProductSupplier = false;
        state.getProductSupplierFailed = payload;
      },
    };
    // Add More InitState
    this.cloneInitState = {
      ...this.initialState,
      isLoadingGetProductSupplier: false,
      getProductSupplierFailed: null,
      productSupplier: [],
      // pagingProductSupplier: null,
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
