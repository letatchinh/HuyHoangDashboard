import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
}
class BotNotificationClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('botNotification');
    this.cloneReducer = {
      ...this.initReducer,
      getListSuccess: (state: initStateSlice, { payload }: any) => {
        state.isLoading = false;
        state.list = payload;
      },
      updateSuccess: (state: initStateSlice, { payload }: { payload: any }) => {
        state.isLoading = false;
        state.updateSuccess = payload;
        state.list = payload;
      },
    };
    this.cloneInitState = {
      ...this.initialState,
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

const newSlice = new BotNotificationClassExtend();
const data = newSlice.createSlice();


export const botNotificationActions = data.actions;
export default data.reducer;
