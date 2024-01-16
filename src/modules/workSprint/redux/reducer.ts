import { createSlice } from "@reduxjs/toolkit";
// import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { InstanceModuleRedux } from "../workSprint.modal";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
}
class WorkSprintClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState: cloneInitState;
  constructor() {
    super('workSprint');
    this.cloneReducer = {
      ...this.initReducer,
      createSuccess: (state: any, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.createSuccess = payload;

        state.list = [...state.list, payload]
        state.createFailed = null;
      },
      updateSuccess: (state: any, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.updateSuccess = payload;
        var findIndexItemUpdated = [...state.list].findIndex((sprint) => sprint._id === payload._id)
        state.list[findIndexItemUpdated] = { ...state.list[findIndexItemUpdated], name: payload.name, note: payload.note }
        state.updateFailed = null;
      },
      deleteSuccess: (state: any, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.deleteSuccess = payload;
        state.list = state.list.filter(({ _id }: any) => _id !== payload._id)
        state.deleteFailed = null;
      }
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
      reducers: this.cloneReducer,
    });
  }

}

const newSlice = new WorkSprintClassExtend();
const data = newSlice.createSlice();


export const workSprintActions = data.actions;
export default data.reducer;
