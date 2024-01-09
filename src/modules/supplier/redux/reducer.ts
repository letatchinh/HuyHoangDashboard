import { get } from "lodash";
import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { createSlice } from "@reduxjs/toolkit";
import { UserResponseOne } from "~/modules/user/user.modal";

class SupplierClassExtentd extends InstanceModuleRedux {
  clone;
  constructor() {
    super('supplier');
    this.clone = {
      ...this.initReducer,
      getListSuccess: (state: initStateSlice<UserResponseOne>, { payload }: { payload?: PaginateResult<UserResponseOne> }) => {
        state.isLoading = false;
        state.list = get(payload, 'docs', []);
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

const newSlice = new SupplierClassExtentd();
const data = newSlice.createSlice();
export const supplierSliceAction   = data.actions;
export default data.reducer;
