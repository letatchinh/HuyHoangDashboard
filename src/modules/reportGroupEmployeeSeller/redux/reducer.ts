import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getPaging } from "~/utils/helpers";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
}
class ReportGroupEmployeeSellerClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('reportGroupEmployeeSeller');
    this.cloneReducer = {
      ...this.initReducer,
      // Want Add more reducer Here...
      getListProductRequest: (state:initStateSlice) => {
        state.isLoading = true;
        state.getListFailed = null;
      },
      getListProductSuccess: (state:initStateSlice , { payload }: any) => {
        state.isLoading = false;
        state.list = get(payload, "docs", []);
        state.paging = getPaging(payload);
      },
      getListProductFailed: (state:initStateSlice, { payload }:{payload:any}) => {
        state.isLoading = false;
        state.getListFailed = payload;
      },
      getGroupSellerRequest: (state:initStateSlice) => {
        state.isLoading = true;
        state.getListFailed = null;
      },
      getGroupSellerSuccess: (state:initStateSlice , { payload }: any) => {
        state.isLoading = false;
        state.list = payload;
        state.paging = getPaging(payload);
      },
      getGroupSellerFailed: (state:initStateSlice, { payload }:{payload:any}) => {
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

const newSlice = new ReportGroupEmployeeSellerClassExtend();
const data = newSlice.createSlice();


export const reportGroupEmployeeSellerActions = data.actions;
export default data.reducer;
