import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";

type anyyy = {
  aa: string;
};
// InstanceModuleRedux
class CloneModule extends InstanceModuleRedux {
  clone;
  cloneInitialState;
  constructor() {
    super("pharmacy");
    this.clone = {
      ...this.initReducer,
      // getListSuccess: (state: initStateSlice, { payload }: any) => {
      //   state.isLoading = false;
      //   state.list = payload;
      // }
    };

    this.cloneInitialState = {
      ...this.initialState,
    };
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitialState,
      reducers: this.clone,
    });
  }
}

const module = new CloneModule();
const data = module.createSlice();

export const pharmacySliceAction = data.actions;
export default data.reducer;
