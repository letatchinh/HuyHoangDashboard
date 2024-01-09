import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

class WorkBoardClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState;
  constructor() {
    super('workBoard');
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

const newSlice = new WorkBoardClassExtend();
const data = newSlice.createSlice();


export const workBoardActions = data.actions;
export default data.reducer;