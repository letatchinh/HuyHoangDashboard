import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
  arrCheckBox?: string[];
 // Add cloneInitState Type Here
};
class VouchersClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('vouchers');
    this.cloneReducer = {
      ...this.initReducer,
      updateArrCheckBox: (state: cloneInitState, {payload}: any) => {
        state.arrCheckBox = payload;
      },
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      arrCheckBox: [],
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

const newSlice = new VouchersClassExtend();
const data = newSlice.createSlice();


export const vouchersSliceAction = data.actions;
export default data.reducer;