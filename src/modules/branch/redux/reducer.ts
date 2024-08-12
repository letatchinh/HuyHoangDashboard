

import { get, omit } from "lodash";
import { PaginateResult } from "~/lib/@types";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { createSlice } from "@reduxjs/toolkit";
import { UserResponseOne } from "~/modules/user/user.modal";
interface cloneInitState extends initStateSlice {
  updateApiKeySuccess?: any;
  updateApiKeyFailed?: any;

  listWarehouse?: any[];
  getListWarehouseFailed?: any;
  isLoadingWarehouse?: boolean;

};
class BranchClassExtentd extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState: cloneInitState
  constructor() {
    super('branch');
    this.cloneReducer = {
      ...this.initReducer,
      updateApiKeyRequest: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = true;
       },
      updateApiKeySuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.updateApiKeySuccess = payload;
        state.list = state.list?.map((item: any) => get(item, '_id') === get(payload, 'data._id') ? payload?.data : item);
      },
      updateApiKeyFailed: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.updateApiKeyFailed = payload;
      },

      getListWarehouseRequest: (state: cloneInitState) => {
        state.isLoadingWarehouse = true;
      },

      getListWarehouseSuccess: (state: cloneInitState, { payload }: any) => {
        state.isLoadingWarehouse = false;
        state.listWarehouse = payload;
      },
      getListWarehouseFailed: (state: cloneInitState, { payload }: any) => {
        state.isLoadingWarehouse = false;
        state.getListWarehouseFailed = payload;
      },

      resetAction: (state: cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, ["list",'paging']),
      })
    };
    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...  
      updateApiKeyFailed: undefined,
      updateApiKeySuccess: undefined,
      listWarehouse: [],
      isLoadingWarehouse: false,
      getListWarehouseFailed: undefined,
    };
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.initialState,
      reducers:  this.cloneReducer,
    });
  }
  
}

const branchSlice = new BranchClassExtentd();
const data = branchSlice.createSlice();


export const branchSliceAction   = data.actions;
export default data.reducer;