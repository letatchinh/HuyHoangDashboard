import { createSlice } from "@reduxjs/toolkit";
import { get,omit } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getPaging } from "~/utils/helpers";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  totalRevenue?: number | null | undefined
}
class CostManagementClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('costManagement');
    this.cloneReducer = {
      ...this.initReducer,
      getListSuccess: (state:cloneInitState , { payload }: any) => {
        state.isLoading = false;
        state.list = get(payload, "docs", []);
        state.paging = getPaging(payload);
        state.totalRevenue = payload?.totalRevenueProduct || 0
      },
      updateSuccess: (state: cloneInitState, { payload }: any) => {
        state.list = state.list?.map((item: any) => get(item, '_id') === get(payload, 'data._id') ? payload?.data : item);
        state.updateSuccess = payload;
        state.isSubmitLoading = false;
      },
      resetActionFullState: (state:cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, ["list", "paging"]),
      }),

      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      totalRevenue: 0
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

const newSlice = new CostManagementClassExtend();
const data = newSlice.createSlice();


export const costManagementActions = data.actions;
const reducer = data.reducer
export default reducer;
