

import { get } from "lodash";
import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { createSlice } from "@reduxjs/toolkit";
import { UserResponseOne } from "~/modules/user/user.modal";

class BranchClassExtentd extends InstanceModuleRedux {
  clone;
  constructor() {
    super('branch');
    this.clone = {
      ...this.initReducer,
      getListSuccess: (state: initStateSlice<UserResponseOne>, { payload }: any) => {
        state.isLoading = false;
        state.list = payload;
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

const branchSlice = new BranchClassExtentd();
const data = branchSlice.createSlice();


export const branchSliceAction   = data.actions;
export default data.reducer;