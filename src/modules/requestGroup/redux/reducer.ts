import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getPaging } from "~/utils/helpers";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  loadingByPartner? : boolean;
  listRequestOfPartner?: any;
  getListRequestOfPartnerFailed?: any;
  pagingRequestOfPartner?: any;

  changeStatusFailed?:any;
  changeStatusSuccess?:any;
};
class RequestGroupClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('requestGroup');
    this.cloneReducer = {
      ...this.initReducer,
      getListRequestOfPartnerRequest: (state: cloneInitState, { payload }: any) => {
        state.loadingByPartner = true;
        state.getListRequestOfPartnerFailed = null;
      },
      getListRequestOfPartnerSuccess: (state: cloneInitState, { payload }: any) => {
        state.loadingByPartner = false;
        state.listRequestOfPartner = get(payload,'docs',[]);
        state.pagingRequestOfPartner = getPaging(payload);
      },
      getListRequestOfPartnerFailed: (state: cloneInitState, { payload }: any) => {
        state.loadingByPartner = false;
        state.getListRequestOfPartnerFailed = payload;
      },

      changeStatusRequest: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = true;
        state.changeStatusFailed = null;
      },
      changeStatusSuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.changeStatusSuccess = payload;
      },
      changeStatusFailed: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.changeStatusFailed = payload;
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

const newSlice = new RequestGroupClassExtend();
const data = newSlice.createSlice();


export const requestGroupActions = data.actions;
export default data.reducer;
