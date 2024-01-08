import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

class StatusConfigClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState;
  constructor() {
    super('statusConfig');
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

const statusConfigSlice = new StatusConfigClassExtend();
const data = statusConfigSlice.createSlice();


export const statusConfigActions = data.actions;
export default data.reducer;