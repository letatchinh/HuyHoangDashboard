import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getPaging } from "~/utils/helpers";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
 getListSuccess? : any
}
class LkClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('lk');
    this.cloneReducer = {
      ...this.initReducer,
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      getListSuccess: (state:initStateSlice , { payload }: any) => {
        state.isLoading = false;
        state.list = get(payload, "docs", []);
        state.paging = getPaging(payload);
      },
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

const newSlice = new LkClassExtend();
const data = newSlice.createSlice();


export const lkActions = data.actions;
export default data.reducer;
