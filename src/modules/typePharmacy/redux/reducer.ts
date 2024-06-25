import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
}
class TypePharmacyClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('typePharmacy');
    this.cloneReducer = {
      ...this.initReducer,
      // Want Add more reducer Here...
      getListSearchRequest: (state:initStateSlice) => {
        state.isLoading = true;
        state.getListFailed = null;
      },
      getListSearchSuccess: (state:initStateSlice , { payload }: any) => {
        state.isLoading = false;
        state.list = payload;
        // state.paging = getPaging(payload);
      },
      getListSearchFailed: (state:initStateSlice, { payload }:{payload:any}) => {
        state.isLoading = false;
        state.getListFailed = payload;
        
      },
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

const newSlice = new TypePharmacyClassExtend();
const data = newSlice.createSlice();


export const typePharmacyActions = data.actions;
export default data.reducer;
