import { get } from "lodash";
import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { createSlice } from "@reduxjs/toolkit";
import { UserResponseOne } from "~/modules/user/user.modal";

class EmployeeClassExtentd extends InstanceModuleRedux {
  clone;
  constructor() {
    super('employee');
    this.clone = {
      ...this.initReducer,
      getListSuccess: (state: initStateSlice, { payload }: { payload?: any }) => {
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

const newSlice = new EmployeeClassExtentd();
const data = newSlice.createSlice();


export const employeeSliceAction   = data.actions;
export default data.reducer;