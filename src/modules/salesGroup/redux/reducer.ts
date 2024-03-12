import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
 listTeamLead? : any,
 isLoadingGetListTeamLead? : boolean,
 getListTeamLeadFailed? : any
}
class SalesGroupClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('salesGroup');
    this.cloneReducer = {
      ...this.initReducer,
      getListSuccess: (state:initStateSlice , { payload }: any) => {
        state.isLoading = false;
        state.list = payload;
      },
          // Get List TeadLead
    getListTeamLeadRequest: (state:cloneInitState) => {
      state.isLoading = true;
      state.getListTeamLeadFailed = null;
    },
    getListTeamLeadSuccess: (state:cloneInitState , { payload }: any) => {
      state.isLoading = false;
      state.list = payload;
    },
    getListTeamLeadFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isLoading = false;
      state.getListTeamLeadFailed = payload;
      
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

const newSlice = new SalesGroupClassExtend();
const data = newSlice.createSlice();


export const salesGroupActions = data.actions;
export default data.reducer;
