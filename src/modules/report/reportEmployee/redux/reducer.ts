import { createSlice } from "@reduxjs/toolkit";
import { get, omit } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { handleCalculateReducer } from "../reportEmployee.service";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  updatePreviewFailed?: any;
  updatePreviewSuccess?: any;
  updateStatusFailed?: any;
  updateStatusSuccess?: any;
}
class ReportEmployeeClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState: cloneInitState;
  constructor() {
    super("reportEmployee");
    this.cloneReducer = {
      ...this.initReducer,
      // Get By Id
      getByIdRequest: (state: cloneInitState) => {
        state.isGetByIdLoading = true;
        state.getByIdFailed = null;
      },
      getByIdSuccess: (
        state: cloneInitState,
        { payload }: { payload?: any }
      ) => {
        state.isGetByIdLoading = false;
        state.byId = handleCalculateReducer(payload);
      },
      getByIdFailed: (state: cloneInitState, { payload }: { payload: any }) => {
        state.isGetByIdLoading = false;
        state.getByIdFailed = payload;
      },

      // Update preview
      updatePreviewRequest: (state: cloneInitState) => {
        state.isSubmitLoading = true;
        state.updatePreviewFailed = null;
      },
      updatePreviewSuccess: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.byId = handleCalculateReducer(payload);
        state.updatePreviewSuccess = payload;
      },
      updatePreviewFailed: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.updatePreviewFailed = payload;
      },

      // Update Status
      updateStatusRequest: (state: cloneInitState) => {
        state.isSubmitLoading = true;
        state.updateStatusFailed = null;
      },
      updateStatusSuccess: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.list = state.list?.map((item:any) => get(item,'_id') === get(payload,'_id') ? payload : item);
        state.updateStatusSuccess = payload;
      },
      updateStatusFailed: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.updateStatusFailed = payload;
      },

  // Reset the state Action
  resetAction: (state:any) => ({
    ...state,
    updatePreviewFailed : null,
    updatePreviewSuccess : null,
    updateSuccess : null,
    updateFailed : null,
    updateStatusFailed : null,
    updateStatusSuccess : null,
  }),
      // Want Add more reducer Here...
    };
    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...
    };
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers: this.cloneReducer,
    });
  }
}

const newSlice = new ReportEmployeeClassExtend();
const data = newSlice.createSlice();

export const reportEmployeeActions = data.actions;
export default data.reducer;
