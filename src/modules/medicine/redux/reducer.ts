import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
  isLoadingSearch? : boolean,
  getListSearchFailed? : any,
  listSearch? : any,
  // Add cloneInitState Type Here
 }
class MedicineClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState;
  constructor() {
    super('medicine');
    this.clone = {
      ...this.initReducer,
          // Get List
    getListSearchRequest: (state:cloneInitState) => {
      state.isLoadingSearch = true;
      state.getListSearchFailed = null;
    },
    getListSearchSuccess: (state:cloneInitState , { payload }: any) => {
      state.isLoadingSearch = false;
      state.listSearch = payload;
    },
    getListSearchFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isLoadingSearch = false;
      state.getListSearchFailed = payload;
      
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
      reducers:  this.clone,
    });
  }
  
}

const medicineSlice = new MedicineClassExtend();
const data = medicineSlice.createSlice();


export const medicineSliceAction = data.actions;
export default data.reducer;
