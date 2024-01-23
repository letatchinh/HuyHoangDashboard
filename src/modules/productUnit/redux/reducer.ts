// import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";

import { createSlice } from "@reduxjs/toolkit";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  isGetAllLoading? : boolean
  unitAll? : any
  getUnitAllFailed? : any
}
class ProductUnitClassExtentd extends InstanceModuleRedux {
  cloneInitState: cloneInitState;
  clone;
  constructor() {
    super("productUnit");
    this.clone = {
      ...this.initReducer,
      getUnitAllRequest: (state: any, { payload }: any) => {
        state.isGetAllLoading = true;
        state.unitAll = [];
        state.getUnitAllFailed = null;
      },
      getUnitAllSuccess: (state: any, { payload }: any) => {
        state.isGetAllLoading = false;
        state.unitAll = payload;
      },
      getUnitAllFailed: (state: any, { payload }: any) => {
        state.isGetAllLoading = false;
        state.getUnitAllFailed = payload;
      },
    };
    this.cloneInitState = {
      ...this.initialState,
      isGetAllLoading: false,
      unitAll: null,
      getUnitAllFailed: null,
      // Want Add more State Here...
    };
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.initialState,
      reducers: this.clone,
    });
  }
}

const productUnitSlice = new ProductUnitClassExtentd();
const data = productUnitSlice.createSlice();

export const productUnitActions = data.actions;
export default data.reducer;
