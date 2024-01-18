import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
 isGetDebtLoading? : boolean,
 getDebtFailed? : any,
 debt? : any,
}
class BillClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('bill');
    this.cloneReducer = {
      ...this.initReducer,
      // Want Add more reducer Here...
    // Get Debt
    getDebtRequest: (state:cloneInitState) => {
      state.isGetDebtLoading = true;
      state.getDebtFailed = null;
    },
    getDebtSuccess: (state:cloneInitState, { payload }:{payload?:any}) => {
      state.isGetDebtLoading = false;
      state.debt = payload;
    },
    getDebtFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isGetDebtLoading = false;
      state.getDebtFailed = payload;
    },
    };

    this.cloneInitState = {
      ...this.initialState,
      isGetDebtLoading : false,
      getDebtFailed : null,
      debt : null,
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

const newSlice = new BillClassExtend();
const data = newSlice.createSlice();


export const billSliceAction = data.actions;
export default data.reducer;
