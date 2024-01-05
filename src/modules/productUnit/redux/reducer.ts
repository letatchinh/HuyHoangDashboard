
// import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";

import { createSlice } from "@reduxjs/toolkit";

class ProductUnitClassExtentd extends InstanceModuleRedux {
  clone;
  constructor() {
    super('productUnit');
    this.clone = {
      ...this.initReducer,
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

const productUnitSlice = new ProductUnitClassExtentd();
const data = productUnitSlice.createSlice();


export const productUnitActions   = data.actions;
export default data.reducer;