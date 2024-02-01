
// import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { get } from "lodash";
import { createSlice } from "@reduxjs/toolkit";

class ProductUnitClassExtentd extends InstanceModuleRedux {
  clone;
  constructor() {
    super('productUnit');
    this.clone = {
      ...this.initReducer,
      updateSuccess: (state: initStateSlice, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.byId = payload;
        state.list = state.list?.map((item: any) => get(item, '_id') === get(payload, 'data._id') ? payload?.data : item);
        state.updateSuccess = payload?.data;
      },
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