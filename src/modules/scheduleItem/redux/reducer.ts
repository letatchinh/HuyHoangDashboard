import { createSlice } from "@reduxjs/toolkit";
import { InitState, InstanceModuleRedux } from "~/redux/instanceModuleRedux";
interface cloneInitState extends InitState {

}
const data = createSlice({
  name: 'scheduleItem',
  initialState: {
    ...InstanceModuleRedux.initialState
  },
  reducers: {
    ...InstanceModuleRedux.initReducer,
  }
})

export const scheduleItemActions = data.actions
export default data.reducer



