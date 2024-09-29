import { createSlice } from "@reduxjs/toolkit";
import { get, omit } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getPaging } from "~/utils/helpers";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
}
class StaffClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('staff');
    this.cloneReducer = {
      ...this.initReducer,
      // Want Add more reducer Here...
      getListSuccess: (state:initStateSlice , { payload }: any) => {
        state.isLoading = false;
        state.list = get(payload, "docs", payload) || [];
        state.paging = getPaging(payload);
      },
      updateSuccess: (state: initStateSlice, { payload }: { payload: any }) => {
        state.updateSuccess = payload;
        state.list = state.list?.map((item:any) => get(item,'_id') === get(payload,'_id') ? payload : item);
        state.isSubmitLoading = false;
      },
      resetAction: (state:cloneInitState) => ({
        ...state,
        ...omit(this.initialState, ["list",'paging','byId']),
      }),
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

const newSlice = new StaffClassExtend();
const data = newSlice.createSlice();


export const staffActions = data.actions;
export default data.reducer;
