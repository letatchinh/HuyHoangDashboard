
// import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";

import { createSlice } from "@reduxjs/toolkit";

class ProductConfigClassExtentd extends InstanceModuleRedux {
  clone;
  constructor() {
    super('productConfig');
    this.clone = {
      ...this.initReducer,
      getListProductConfigSuccess: (state: initStateSlice, action: any) => {
                state.isLoading = false;
                state.list = action.payload;
            }
    }
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.initialState,
      reducers:  this.clone,
    });
  }
  
}

const productConfigSlice = new ProductConfigClassExtentd();
const data = productConfigSlice.createSlice();


export const productConfigSliceAction   = data.actions;
export default data.reducer;