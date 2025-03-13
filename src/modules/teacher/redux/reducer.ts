import { createSlice } from "@reduxjs/toolkit";
import { InitState, InstanceModuleRedux } from "~/redux/instanceModuleRedux";
interface cloneInitState extends InitState {
}

const cloneInitState = {
  ...InstanceModuleRedux.initialState,

} as cloneInitState

const data = createSlice({
  name: 'teacher',
  initialState: cloneInitState,
  reducers: {
    ...InstanceModuleRedux.initReducer,

  }
})

export const teacherActions = data.actions
export default data.reducer




