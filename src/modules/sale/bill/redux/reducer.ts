import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { cumulativeDiscountType } from "~/modules/cumulativeDiscount/cumulativeDiscount.modal";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getDiscountAmount } from "../bill.service";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
 isGetDebtLoading? : boolean,
 getDebtFailed? : any,
  debt?: any,
  listProductSuggest?:any,
  isProductSuggestLoading?: boolean,
  getProductSuggestFailed?: any,
}
class BillClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('bill');
    this.cloneReducer = {
      ...this.initReducer,
      // Want Add more reducer Here...
    // Get Debt
    getDebtRequest: (state:cloneInitState) => {
      state.isGetDebtLoading = true;
      state.getDebtFailed = null;
    },
    getDebtSuccess: (state:cloneInitState, { payload }:{payload?:any}) => {
      state.isGetDebtLoading = false;
      state.debt = payload;
    },
    getDebtFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isGetDebtLoading = false;
      state.getDebtFailed = payload;
    },
    getByIdSuccess: (state:cloneInitState, { payload }:{payload?:any}) => {
      state.isGetByIdLoading = false;
      const billItems = get(payload,'billItems',[])?.map((billItem : any) => {
        const price : number = get(billItem, 'variant.price',0);
        const totalDiscount : number = get(billItem,'cumulativeDiscount',[])?.reduce((sum:number,cur : cumulativeDiscountType) => sum + getDiscountAmount(cur,price),0);
        const remainAmount = price - totalDiscount;
        return {
          ...billItem,
          totalDiscount,
          remainAmount : remainAmount > 0 ? remainAmount : 0
        }
      });
      state.byId = {
        ...payload,
        billItems
      }
      },
    getListProductSuggestRequest: (state:cloneInitState) => {
      state.isProductSuggestLoading = true;
      },
    getListProductSuggestSuccess: (state:cloneInitState, { payload }:{payload?:any}) => {
      state.isProductSuggestLoading = false;
      state.listProductSuggest = payload;
      },
    getListProductSuggestFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isProductSuggestLoading = false;
      state.getProductSuggestFailed = payload;
    },
    };

    this.cloneInitState = {
      ...this.initialState,
      isGetDebtLoading : false,
      getDebtFailed : null,
      debt: null,
      
      listProductSuggest: [],
      isProductSuggestLoading: false,
      getProductSuggestFailed: null,
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

const newSlice = new BillClassExtend();
const data = newSlice.createSlice();


export const billSliceAction = data.actions;
export default data.reducer;
