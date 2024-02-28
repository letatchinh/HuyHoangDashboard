import { createSlice } from "@reduxjs/toolkit";
import { get, omit } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getPaging } from "~/utils/helpers";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
}
class ProductClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('product');
    this.cloneReducer = {
      ...this.initReducer,
      getListSuccess: (state:initStateSlice , { payload }: any) => {
        state.isLoading = false;
        // Find Variant Default
        const list = get(payload, "docs", [])?.map((item:any) => {
          const variant = get(item,'variants',[])?.find((v: any) => get(v,'variantIsDefault'));
          return {...item, variant};
        });
        state.list = list;
        state.paging = getPaging(payload);
      },
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

      updateSuccess: (state:initStateSlice, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.byId = payload;
        state.list = state.list?.map((item:any) => get(item,'_id') === get(payload,'data._id') ? {...item,...get(payload,'data')} : item);
        state.updateSuccess = payload;
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

const newSlice = new ProductClassExtend();
const data = newSlice.createSlice();


export const productActions = data.actions;
export default data.reducer;