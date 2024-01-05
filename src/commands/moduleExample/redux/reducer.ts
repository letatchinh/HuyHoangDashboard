import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

class ModuleExampleClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState;
  constructor() {
    super('moduleExample');
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

const newSlice = new ModuleExampleClassExtend();
const data = newSlice.createSlice();


export const moduleExampleActions = data.actions;
export default data.reducer;