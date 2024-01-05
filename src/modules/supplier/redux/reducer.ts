// import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

// // InstanceModuleRedux
// const supplierSlice = new InstanceModuleRedux('supplier');


// /**
//  * Want to Add more Slice for this module use This
//  */
// supplierSlice.extendsSlice({});


// /**
//  * 
//  * 
//  * Want to Add more State for this module use This
//  */
// supplierSlice.extendsStates({});


// // Start Create Slice
// const data = supplierSlice.createSlice();

// // export action and Reducer;

// // Want Suggettion ?
// // interface reducerType  extends voidReducer {
// //     // onR? : (state:any) => void
// // }
// export const supplierSliceAction = data.actions;
// export default data.reducer;


// import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";

import { createSlice } from "@reduxjs/toolkit";

class SupplierClassExtentd extends InstanceModuleRedux {
  clone;
  constructor() {
    super('supplier');
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

const supplierSlice = new SupplierClassExtentd();
const data = supplierSlice.createSlice();


export const supplierSliceAction   = data.actions;
export default data.reducer;