import { createSlice } from "@reduxjs/toolkit";
// import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { cloneInitState } from "../workBoard.modal";
import { InstanceModuleRedux } from "~/modules/workSprint/workSprint.modal";
class WorkBoardClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState:cloneInitState;
  constructor() {
    super('workBoard');
    this.clone = {
      ...this.initReducer,
      getAllManagersRequest: (state: any) => {
        state.isLoadingGetProductSupplier = true;
        state.getProductSupplierFailed = null;
      },
      getAllManagersSuccess: (state: any, { payload }: any) => {
        console.log(payload,'manager');
        state.isLoadingGetAllManagers = false;
        state.allManagers = payload;
      },
      getAllManagersFailed: (state: any, { payload }: any) => {
        state.isLoadingGetAllManagers = false;
        state.getAllManagersFailed = payload;
      },
      ...this.initReducer,
      getAllEmployeeRequest: (state: any) => {
        state.isLoadingGetAllEmployee = true;
        state.getAllEmployeeFailed = null;
      },
      getAllEmployeeSuccess: (state: any, { payload }: any) => {
        state.isLoadingGetAllEmployee = false;
        state.allEmployee = payload;
      },
      getAllEmployeeFailed: (state: any, { payload }: any) => {
        state.isLoadingGetAllEmployee = false;
        state.getAllEmployeeFailed = payload;
      },
      getListBoardRequest : (state: any) => {
        state.isLoadingGetListBoard = true;
        state.getListBoardFailed = null;
      },
      getListBoardSuccess : (state: any, { payload }: any) => {
        state.isLoadingGetListBoard = false;
        state.listBoard = payload;
      },
      getListBoardFailed : (state: any, { payload }: any) => {
        state.isLoadingGetListBoard = false;
        state.getListBoardFailed = payload;
      },
      getListManagerByIdRequest : (state: any) => {
        state.isLoadingGetListManagerById = true;
        state.getListManagerByIdFailed = null;
      },
      getListManagerByIdSuccess : (state: any, { payload }: any) => {
        state.isLoadingGetListManagerById = false;
        state.listManagerById = payload;
      },
      getListManagerByIdFailed : (state: any, { payload }: any) => {
        state.isLoadingGetListManagerById = false;
        state.getListManagerByIdFailed = payload;
      },
      getListEmployeeByIdRequest : (state: any) => {
        state.isLoadingGetListEmployeeById = true;
        state.getListEmployeeByIdFailed = null;
      },
      getListEmployeeByIdSuccess : (state: any, { payload }: any) => {
        state.isLoadingGetListEmployeeById = false;
        state.listEmployeeById = payload;
      },
      getListEmployeeByIdFailed : (state: any, { payload }: any) => {
        state.isLoadingGetListEmployeeById = false;
        state.getListEmployeeByIdFailed = payload;
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
      reducers:  this.clone,
    });
  }
  
}

const workBoardSlice = new WorkBoardClassExtend();
const data = workBoardSlice.createSlice();


export const workBoardActions = data.actions;
export default data.reducer;