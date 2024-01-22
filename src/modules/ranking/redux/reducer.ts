import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";

class RankingClassExtend extends InstanceModuleRedux {
  clone;
  // cloneInitState;
  constructor() {
    super('ranking');
    this.clone = {
      ...this.initReducer,
    }
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.initialState,
      reducers:  this.clone,
    });
  }
  
}

const rankingSlice = new RankingClassExtend();
const data = rankingSlice.createSlice();


export const rankingSliceAction = data.actions;
export default data.reducer;
