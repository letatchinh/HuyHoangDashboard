import { get, omit } from "lodash";
import { getPaging } from "~/utils/helpers";
import { createSlice } from "@reduxjs/toolkit";
import { InitState, InstanceModuleRedux } from "~/redux/instanceModuleRedux";
interface cloneInitState extends InitState {

}
const data = createSlice({
  name: 'staff',
  initialState: {
    ...InstanceModuleRedux.initialState
  },
  reducers: {
    ...InstanceModuleRedux.initReducer,
    getListSuccess: (state: cloneInitState, { payload }: any) => {
      state.isLoading = false;
      state.list = get(payload, "docs", payload) || [];
      state.paging = getPaging(payload);
    },
    updateSuccess: (state: cloneInitState, { payload }: { payload: any }) => {
      state.updateSuccess = payload;
      state.list = state.list?.map((item: any) => get(item, '_id') === get(payload, '_id') ? payload : item);
      state.isSubmitLoading = false;
    },
    resetAction: (state: cloneInitState) => {
      state = {
        ...state,
        ...omit(InstanceModuleRedux.initialState, ["list", 'paging', 'byId']),
      }
    },
  }
})

export const staffActions = data.actions
export default data.reducer




