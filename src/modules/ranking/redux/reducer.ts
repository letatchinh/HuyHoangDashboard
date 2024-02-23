import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { get } from "lodash";
import { initStateSlice } from "~/redux/models";
class RankingClassExtend extends InstanceModuleRedux {
  clone;
  // cloneInitState;
  constructor() {
    super('ranking');
    this.clone = {
      ...this.initReducer,
      updateSuccess: (state: initStateSlice, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.byId = payload;
        state.list = state.list?.map((item: any) => get(item, '_id') === get(payload, 'data._id') ? payload?.data : item);
        state.updateSuccess = payload;
      },
    }
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.initialState,
      reducers: this.clone,
    });
  }

}

const rankingSlice = new RankingClassExtend();
const data = rankingSlice.createSlice();


export const rankingSliceAction = data.actions;
export default data.reducer;
