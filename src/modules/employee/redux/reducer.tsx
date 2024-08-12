import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { createSlice } from "@reduxjs/toolkit";
import { getPaging } from "~/utils/helpers";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  convertFailed?: any,
  convertSuccess?: any,
  isGetMyEmployeeLoading?: any,
  getMyEmployeeFailed?: any,
  myEmployee?: any[]
 
  addProductFailed?: any,
  addProductSuccess?: any,
  removeProductFailed?: any,
  removeProductSuccess?: any,
  updateProductFailed?: any,
  updateProductSuccess?: any,
  updateAddressFailed?: any,
  updateAddressSuccess?: any,
 }
class EmployeeClassExtentd extends InstanceModuleRedux {
  clone;
  constructor() {
    super('employee');
    this.clone = {
      ...this.initReducer,
      getListSuccess: (state: initStateSlice, { payload }: { payload?: any }) => {
        state.isLoading = false;
        state.list = get(payload, 'docs', []);
        state.paging = getPaging(payload);
      },
      // updateSuccess: (state: initStateSlice, { payload }: { payload?: any }) => {
      //   state.isLoading = false;
      //   state.updateSuccess = get(payload, 'data', {});
      //   state.list = state?.list?.map((item: any) => {
      //     if (item._id === payload?.data?._id) {
      //       return payload?.data;
      //     } else {
      //       return item;
      //     };
      //   });
      // },
      convertRequest: (state: cloneInitState) => {
        state.isSubmitLoading = true;
        state.convertFailed = null;
      },

      convertSuccess: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.convertSuccess = payload;
      },
      convertFailed: (state: cloneInitState, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.convertFailed = payload;
      },

      getMyEmployeeRequest: (state: cloneInitState) => {
        state.isGetMyEmployeeLoading = true;
        state.getMyEmployeeFailed = null;
      },
      getMyEmployeeSuccess: (state: cloneInitState, { payload }: { payload?:any }) => {
        state.isGetMyEmployeeLoading = false;
        state.myEmployee = payload;
      },
      getMyEmployeeFailed: (state: cloneInitState, { payload }: { payload:any }) => {
        state.isGetMyEmployeeLoading = false;
        state.getMyEmployeeFailed = payload;
      },
    addProductRequest: (state: cloneInitState) => {
      state.isSubmitLoading = true;
      state.addProductFailed = null;
    },
    addProductSuccess: (state: cloneInitState, { payload }: { payload?:any }) => {
        state.byId = {
          ...state.byId,
          products : payload
        }
        state.isSubmitLoading = false;
        state.addProductSuccess = payload;
      },
      addProductFailed: (state: cloneInitState, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.addProductFailed = payload;
      },

      removeProductRequest: (state: cloneInitState) => {
        state.isSubmitLoading = true;
        state.removeProductFailed = null;
      },
      removeProductSuccess: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.byId = {
          ...state.byId,
          products : payload
        }
        state.removeProductSuccess = payload;
      },
      removeProductFailed: (state: cloneInitState, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.removeProductFailed = payload;
      },

      updateProductRequest: (state: cloneInitState) => {
        state.isSubmitLoading = true;
        state.updateProductFailed = null;
      },
      updateProductSuccess: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.byId = {
          ...state.byId,
          products : payload
        }
        state.updateProductSuccess = payload;
      },
      updateProductFailed: (state: cloneInitState, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.updateProductFailed = payload;
      },
    }
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.initialState,
      reducers:  this.clone,
    });
  }
  
}

const newSlice = new EmployeeClassExtentd();
const data = newSlice.createSlice();


export const employeeSliceAction   = data.actions;
export default data.reducer;