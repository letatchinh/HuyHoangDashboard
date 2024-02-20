// import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

// const manufacturerSlice = new InstanceModuleRedux('manufacturer');

// manufacturerSlice.extendsSlice({
//     getListManufacturerSuccess: (state: any, action: any) => {
//         state.isLoading = false;
//         state.list = action.payload;
//     }
// });
// manufacturerSlice.extendsStates({});

// const data = manufacturerSlice.createSlice();
// export const manufacturerSliceAction = data.actions;
// export default data.reducer;

// import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";

import { createSlice } from "@reduxjs/toolkit";

class ManufacturerClassExtentd extends InstanceModuleRedux {
  clone;
  constructor() {
    super('manufacturer');
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

const manufacturerSlice = new ManufacturerClassExtentd();
const data = manufacturerSlice.createSlice();


export const manufacturerSliceAction   = data.actions;
export default data.reducer;