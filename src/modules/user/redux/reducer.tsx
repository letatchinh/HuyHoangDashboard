import { get } from "lodash";
import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { UserResponseOne } from "../user.modal";
import { createSlice } from "@reduxjs/toolkit";

class UserClassExtend extends InstanceModuleRedux {
  clone;
  constructor() {
    super('user');
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

const newSlice = new UserClassExtend();
const data = newSlice.createSlice();


export const userSliceAction   = data.actions;
export default data.reducer;