import { createSlice } from "@reduxjs/toolkit";
import { InitState, InstanceModuleRedux } from "~/redux/instanceModuleRedux";
interface cloneInitState extends InitState {

}
const data = createSlice({
  name: 'course',
  initialState: {
    ...InstanceModuleRedux.initialState
  },
  reducers: {
    ...InstanceModuleRedux.initReducer,
    getListSuccess: (state: cloneInitState, { payload }: any) => {
      state.isLoading = false;
      state.list = payload;
    },
  }
})

export const courseActions = data.actions
export default data.reducer



