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
 }
 
class EmployeeClassExtentd extends InstanceModuleRedux {
  clone;
  cloneInitState : cloneInitState;
  constructor() {
    super('employee');
    this.clone = {
      ...this.initReducer,
      getListSuccess: (state: initStateSlice, { payload }: { payload?: any }) => {
        state.isLoading = false;
        state.list = get(payload, 'docs', []);
        state.paging = getPaging(payload);
      },
      updateSuccess: (state: initStateSlice, { payload }: { payload?: any }) => {
        state.isLoading = false;
        state.updateSuccess = get(payload, 'data', {});
        state.list = state?.list?.map((item: any) => {
          if (item._id === payload?.data?._id) {
            return payload?.data;
          } else {
            return item;
          };
        });
      },
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
    }
    this.cloneInitState = {
      ...this.initialState,
      convertFailed: null,
      convertSuccess: null,
      // Want Add more State Here...
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