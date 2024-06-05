import { createSlice } from "@reduxjs/toolkit";
import { omit } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  updateManagementWarehouseSuccess?: any;
  updateManagementWarehouseFailed?: any;

  checkWarehouseSuccess?: any;
  checkWarehouseFailed?: any;

  warehouseLinkedSuccess?: any;
  warehouseLinkedFailed?: any;

  createBillToWarehouseSuccess?: any;
  createBillToWarehouseFailed?: any;

};
class WarehouseClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('warehouse');
    this.cloneReducer = {
      ...this.initReducer,
          updateManagementWarehouseRequest: (state: cloneInitState, { payload }: any) => {
            state.isSubmitLoading = true;
      },
      updateManagementWarehouseSuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.updateManagementWarehouseSuccess = payload;
      },
      updateManagementWarehouseFailed: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.updateManagementWarehouseFailed = payload;
      },

      checkWarehouseRequest: (state: cloneInitState, { payload }: any) => { 
        state.isLoading = true;
      },
      checkWarehouseSuccess: (state: cloneInitState, { payload }: any) => {
        state.isLoading = false;
        state.checkWarehouseSuccess = payload;
      },
      checkWarehouseFailed: (state: cloneInitState, { payload }: any) => {
        state.isLoading = false;
        state.checkWarehouseFailed = payload;
      },

      getWarehouseLinkedRequest: (state: cloneInitState, { payload }: any) => {
        state.isLoading = true;
      },
      getWarehouseLinkedSuccess: (state: cloneInitState, { payload }: any) => {
        state.isLoading = false;
        state.warehouseLinkedSuccess = payload;
      },
      getWarehouseLinkedFailed: (state: cloneInitState, { payload }: any) => {
        state.isLoading = false;
        state.warehouseLinkedFailed = payload;
      },

      //CREATE BILL TO WAREHOUSE
      createBillToWarehouseRequest: (state: cloneInitState, { payload }: any) => { 
        state.isSubmitLoading = true;
      },
      createBillToWarehouseSuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.createBillToWarehouseSuccess = payload;
      },
      createBillToWarehouseFailed: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.createBillToWarehouseFailed = payload;
      },
      resetAction: (state: cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, ["list", "warehouseLinkedSuccess"]),
      }),
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      updateManagementWarehouseSuccess: null,
      updateManagementWarehouseFailed: null,

      checkWarehouseSuccess: null,
      checkWarehouseFailed: null,

      warehouseLinkedSuccess: null,
      warehouseLinkedFailed: null,

      createBillToWarehouseSuccess: null,
      createBillToWarehouseFailed: null,
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

const newSlice = new WarehouseClassExtend();
const data = newSlice.createSlice();


export const warehouseActions = data.actions;
export default data.reducer;
