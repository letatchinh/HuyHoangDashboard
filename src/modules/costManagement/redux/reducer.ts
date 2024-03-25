import { createSlice } from "@reduxjs/toolkit";
import { get,omit } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
}
class CostManagementClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('costManagement');
    this.cloneReducer = {
      ...this.initReducer,
      changeVariantDefault: (state:initStateSlice , { payload }: any) => {
        const {productId, variantId} = payload;
        const list = state.list?.map((item:any) => {
          if(get(item,'_id') === productId){
            const variant = get(item,'variants',[])?.find((v: any) => get(v,'_id') === variantId);
            return {...item, variant};
          }
          return item;
        });
        state.list = list;
      },
      resetActionFullState: (state:any) => ({
        ...state,
        ...omit(this.cloneInitState, ["list"]),
      }),
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

const newSlice = new CostManagementClassExtend();
const data = newSlice.createSlice();


export const costManagementActions = data.actions;
export default data.reducer;
