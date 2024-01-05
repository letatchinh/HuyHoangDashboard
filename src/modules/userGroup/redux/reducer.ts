import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

class UserClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState;
  constructor() {
    super('userGroup');
    this.clone = {
      ...this.initReducer,
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...
    };
    const addState = {
      resources: [],
      isGetResourcesLoading: false,
      getResourcesFailed: null,
      actions: [],
    }
    // Object.assign(this.cloneInitState,addState);
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers:  this.clone,
    });
  }
  
}

const newSlice = new UserClassExtend();
const data = newSlice.createSlice();


export const userGroupSliceAction = data.actions;
export default data.reducer;