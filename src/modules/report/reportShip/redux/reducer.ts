import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
 summaryData? : any;
 summaryLoading? : any;
 summaryFailed? : any;
}
class ReportShipClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('reportShip');
    this.cloneReducer = {
      ...this.initReducer,
      // Update preview
      getSummaryRequest: (state: cloneInitState) => {
        state.summaryLoading = true;
        state.summaryFailed = null;
      },
      getSummarySuccess: (state: cloneInitState,{payload} : {payload : any}) => {
        state.summaryLoading = false;
        state.summaryData = payload;
      },
      getSummaryFailed: (state: cloneInitState,{payload} : {payload : any}) => {
        state.summaryLoading = false;
        state.summaryFailed = payload;
      },
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      summaryData : null,
      summaryLoading : false,
      summaryFailed : null,
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

const newSlice = new ReportShipClassExtend();
const data = newSlice.createSlice();


export const reportShipActions = data.actions;
export default data.reducer;
