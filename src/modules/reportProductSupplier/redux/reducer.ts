import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getPaging } from "~/utils/helpers";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
}
class ReportProductSupplierClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('reportProductSupplier');
    this.cloneReducer = {
      ...this.initReducer,
      getListDataRequest: (state:initStateSlice) => {
        state.isLoading = true;
        state.getListFailed = null;
      },
      getListDataSuccess: (state:initStateSlice , { payload }: any) => {
        state.isLoading = false;
        state.list = get(payload, "docs", []);
        state.paging = getPaging(payload);
      },
      getListDataFailed: (state:initStateSlice, { payload }:{payload:any}) => {
        state.isLoading = false;
        state.getListFailed = payload;
        
      },
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

const newSlice = new ReportProductSupplierClassExtend();
const data = newSlice.createSlice();


export const reportProductSupplierActions = data.actions;
export default data.reducer;
