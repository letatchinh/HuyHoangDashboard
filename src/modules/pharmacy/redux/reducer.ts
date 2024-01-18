import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";

// InstanceModuleRedux
class PharmacyExtendModule extends InstanceModuleRedux {
  clone;
  constructor() {
    super("pharmacy");
    this.clone = {
      ...this.initReducer,
      // getListSuccess: (state: initStateSlice, { payload }: any) => {
      //   state.isLoading = false;
      //   state.list = payload;
      // }
      getListPharmacySuccess: (state: initStateSlice, { payload }: any) => {
        state.isLoading = false;
        state.list = payload;
    }
    };

 
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.initialState,
      reducers:  this.clone,
    });
  }
}

const module = new PharmacyExtendModule();
const data = module.createSlice();

export const pharmacySliceAction = data.actions;
export default data.reducer;
