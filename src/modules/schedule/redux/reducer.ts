import { createSlice } from "@reduxjs/toolkit";
import { clone, get } from "lodash";
import { InitState, InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { ScheduleBase } from "../schedule.modal";
interface cloneInitState extends InitState {
  // Add cloneInitState Type Here
  listByCourseId?: any[];
  listByCourseIdLoading?: boolean;
  getListByCourseIdFailed?: any;
}


const data = createSlice({
  name: 'schedule',
  initialState: {
    ...InstanceModuleRedux.initialState,
    listByCourseId: [],
    listByCourseIdLoading: false,
    getListByCourseIdFailed: null,
  },
  reducers: {
    ...InstanceModuleRedux.initReducer,
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
    createSuccess: (state: cloneInitState, { payload }: { payload: any }) => {
      state.isSubmitLoading = false;
      state.createSuccess = payload;
      const cloneData = clone(state.listByCourseId || []);
      state.listByCourseId = [...cloneData, payload]
    },
    deleteSuccess: (state: cloneInitState, { payload }: { payload: any }) => {
      state.isSubmitLoading = false;
      state.deleteSuccess = payload;
      const cloneData = clone(state.listByCourseId || []);
      state.listByCourseId = cloneData?.filter((item: ScheduleBase) => item?._id !== payload?._id);
    },
    updateSuccess: (state: cloneInitState, { payload }: { payload: any }) => {
      state.isSubmitLoading = false;
      const data = payload;
      state.byId = data;
      state.listByCourseId = state.listByCourseId?.map((item: any) => get(item, '_id') === get(data, '_id') ? data : item);
      state.listSearch = state.listSearch?.map((item: any) => get(item, '_id') === get(data, '_id') ? data : item);
      state.updateSuccess = data;
    },
  }
})

export const scheduleActions = data.actions
export default data.reducer