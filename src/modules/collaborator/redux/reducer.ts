import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
 convertFailed?: any,
 convertSuccess?: any,
}
class CollaboratorClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('collaborator');
    this.cloneReducer = {
      ...this.initReducer,
      // Want Add more reducer Here...
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
      initialState: this.cloneInitState,
      reducers:  this.cloneReducer,
    });
  }
  
}

const newSlice = new CollaboratorClassExtend();
const data = newSlice.createSlice();


export const collaboratorActions = data.actions;
export default data.reducer;
