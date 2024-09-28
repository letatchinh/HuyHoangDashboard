import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
}
class CourseClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('course');
    this.cloneReducer = {
      ...this.initReducer,
      getListSuccess: (state:initStateSlice , { payload }: any) => {
        state.isLoading = false;
        state.list = payload;
      },
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
      reducers:  this.cloneReducer,
    });
  }
  
}

const newSlice = new CourseClassExtend();
const data = newSlice.createSlice();


export const courseActions = data.actions;
export default data.reducer;
