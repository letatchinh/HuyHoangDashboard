import { createSlice } from "@reduxjs/toolkit";
import { get, omit } from "lodash";
import { cumulativeDiscountType } from "~/modules/cumulativeDiscount/cumulativeDiscount.modal";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getDiscountAmount } from "../bill.service";
import { STATUS_BILL } from "../constants";
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
 isGetDebtLoading? : boolean,
 getDebtFailed? : any,
 debt? : any,
 updateBillItemFailed? : any,
 updateBillItemSuccess? : any,

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
        const price : number = get(billItem, 'variant.price',1) * get(billItem, 'quantity',1);
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
    updateSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.byId = {
        ...state.byId,
        status : STATUS_BILL.CANCELLED
      };
      // state.list = state.list?.map((item:any) => get(item,'_id') === get(payload,'_id') ? payload : item);
      state.updateSuccess = payload;
    },

    // update billItem
    updateBillItemRequest: (state:cloneInitState) => {
      state.isSubmitLoading = true;
      state.updateBillItemFailed = null;
    },
    updateBillItemSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      const billItemId = Object.keys(payload)?.[0];
      const payloadUpdate = get(payload,billItemId,{});
      const billItems = get(state.byId,'billItems',[])?.map((billItem : any) => {
        if(billItemId === get(billItem,'_id')){
          return {
            ...billItem,
            ...payloadUpdate
          }
        }
        return billItem;
      
      });
      state.byId = {
        ...state.byId,
        billItems
      }
      state.updateBillItemSuccess = payload;
    },
    updateBillItemFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.updateBillItemFailed = payload;
    },
    resetAction: (state:any) => ({
      ...state,
      ...omit(this.cloneInitState, ["list"]),
    }),
    };

    this.cloneInitState = {
      ...this.initialState,
      isGetDebtLoading : false,
      getDebtFailed : null,
      debt : null,
      updateBillItemFailed : null,
      updateBillItemSuccess : null,
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
