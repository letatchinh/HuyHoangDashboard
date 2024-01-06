import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

class MedicineClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState;
  constructor() {
    super('medicine');
    this.clone = {
      ...this.initReducer,
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...
    }
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers:  this.clone,
    });
  }
  
}

const medicineSlice = new MedicineClassExtend();
const data = medicineSlice.createSlice();


export const medicineSliceAction = data.actions;
export default data.reducer;
