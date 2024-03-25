
// import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { get } from "lodash";

import { createSlice } from "@reduxjs/toolkit";

class ProductGroupClassExtentd extends InstanceModuleRedux {
  clone;
  constructor() {
    super('productGroup');
    this.clone = {
      ...this.initReducer,
      getListProductGroupSuccess: (state: initStateSlice, action: any) => {
        state.isLoading = false;
        state.list = action.payload;
      },
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
      reducers: this.clone,
    });
  }

}

const productGroupSlice = new ProductGroupClassExtentd();
const data = productGroupSlice.createSlice();


export const productGroupSliceAction = data.actions;
export default data.reducer;