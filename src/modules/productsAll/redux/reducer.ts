import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getPaging } from "~/utils/helpers";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  supplierInfo?: any
}
class ProductsAllClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('productsAll');
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
      setSupplierInfo: (state: cloneInitState, { payload }: any) => {
        console.log(payload,'payload')
        state.supplierInfo = payload;
      },
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      supplierInfo: undefined,
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

const newSlice = new ProductsAllClassExtend();
const data = newSlice.createSlice();


export const productsAllSliceAction = data.actions;
export default data.reducer;
