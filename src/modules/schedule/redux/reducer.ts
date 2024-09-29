import { createSlice } from "@reduxjs/toolkit";
import { clone, get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { ScheduleBase } from "../schedule.modal";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  listByCourseId?: any[];
  listByCourseIdLoading?: boolean;
  getListByCourseIdFailed?: any;
}
class ScheduleClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState: cloneInitState;
  constructor() {
    super("schedule");
    this.cloneReducer = {
      ...this.initReducer,
      // Get List
      getListByCourseIdRequest: (state: cloneInitState) => {
        state.listByCourseIdLoading = true;
        state.getListByCourseIdFailed = null;
      },
      getListByCourseIdSuccess: (state: cloneInitState, { payload }: any) => {
        state.listByCourseIdLoading = false;
        state.listByCourseId = payload;
      },
      getListByCourseIdFailed: (state: cloneInitState, { payload }: { payload: any }) => {
        state.listByCourseIdLoading = false;
        state.getListByCourseIdFailed = payload;
      },
      createSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.createSuccess = payload;
        const cloneData = clone(state.listByCourseId || []);
        state.listByCourseId = [...cloneData,payload]
      },
      deleteSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.deleteSuccess = payload;
        const cloneData = clone(state.listByCourseId || []);
        state.listByCourseId = cloneData?.filter((item : ScheduleBase) => item?._id !== payload?._id);
      },
      updateSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        const data = payload;
        state.byId = data;
        state.listByCourseId = state.listByCourseId?.map((item:any) => get(item,'_id') === get(data,'_id') ? data : item);
        state.listSearch = state.listSearch?.map((item:any) => get(item,'_id') === get(data,'_id') ? data : item);
        state.updateSuccess = data;
      },
      // Want Add more reducer Here...
    };
    this.cloneInitState = {
      ...this.initialState,
      listByCourseId: [],
      listByCourseIdLoading: false,
      getListByCourseIdFailed: null,
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

const newSlice = new ScheduleClassExtend();
const data = newSlice.createSlice();

export const scheduleActions = data.actions;
export default data.reducer;
