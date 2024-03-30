import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
}
class CronSalaryClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('cronSalary');
    this.cloneReducer = {
      ...this.initReducer,
      getListSuccess: (state: initStateSlice, { payload }: any) => {
        state.isLoading = false;
        state.list = payload;
      },
      updateSuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.list = payload;
        state.updateSuccess = payload;
      },
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
      reducers:  this.cloneReducer,
    });
  }
  
}

const newSlice = new CronSalaryClassExtend();
const data = newSlice.createSlice();


export const cronSalaryActions = data.actions;
export default data.reducer;
