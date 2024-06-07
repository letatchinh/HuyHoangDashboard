import { createSlice } from "@reduxjs/toolkit";
import { get, omit } from "lodash";
// import { cumulativeDiscountType } from "~/modules/cumulativeDiscount/cumulativeDiscount.modal";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getValueOfPercent } from "~/utils/helpers";
import { FeeType } from "../bill.modal";
// import { CalculateBill, CalculateDiscountFactory } from "../bill.service";
import { STATUS_BILL } from "../constants";
// const CalculateBillMethod = new CalculateBill();
interface cloneInitState extends initStateSlice {
 // Add cloneInitState Type Here
  isGetDebtLoading? : boolean,
  getDebtFailed? : any,
  debt? : any,
  updateBillItemFailed? : any,
  updateBillItemSuccess?: any,
  
  updateLogisticSuccess? : any,
  updateLogisticFailed? : any,

  listProductSuggest?:any,
  isProductSuggestLoading?: boolean,
  getProductSuggestFailed?: any,
  pagingProductSuggest?:any ;
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
      // const CalculateDiscountMethod = new CalculateDiscountFactory();
      state.isGetByIdLoading = false;
      let totalDiscountBill = 0;
      let totalAmountBill = 0;
      const billItems = get(payload,'billItems',[])?.map((billItem : any) => {
        // const {variant} = billItem || {};
        // console.log(billItem,'billItem');
        const quantity:number = Number((get(billItem, "quantity", 1) / get(billItem, "variant.exchangeValue", 1)).toFixed(1));
        const price : number = get(billItem, 'variant.price',1);
        const totalPrice : number = get(billItem, 'totalPrice',1);
        const totalAmount = Math.floor(Number(quantity * price));
        const totalDiscount : number = totalAmount - totalPrice;

        totalDiscountBill += totalDiscount;
        totalAmountBill += totalAmount;
        return {
          ...billItem,
          totalAmount,
          totalDiscount,
        }
      });
      const remainAmount = get(payload,'remaining',0);
      const totalFee = (get(payload,'fee',[]))?.reduce((sum : number,cur : FeeType) => sum + (cur?.typeValue === 'PERCENT' ? getValueOfPercent(get(payload,'totalAmount',0),cur?.value) : cur?.value),0);
      const feeDetail = (get(payload,'fee',[]))?.reduce((sum : {SUB_FEE : number,LOGISTIC : number},cur : FeeType) =>  {
        sum[cur.typeFee] = (sum[cur.typeFee] || 0) + (cur?.typeValue === 'PERCENT' ? getValueOfPercent(get(payload,'totalAmount',0),cur?.value) : cur?.value);
        return sum;
      },{
        SUB_FEE : 0,
        LOGISTIC : 0,
      });
      // sum + (cur?.typeValue === 'PERCENT' ? getValueOfPercent(get(payload,'totalAmount',0),cur?.value) : cur?.value)
      state.byId = {
        ...payload,
        billItems,
        remainAmount,
        totalDiscountBill,
        totalAmountBill,
        totalAfterDiscountBill : totalAmountBill - totalDiscountBill,
        totalFee,
        feeDetail,
      }
      },
    getListProductSuggestRequest: (state:cloneInitState) => {
      state.isProductSuggestLoading = true;
      },
    getListProductSuggestSuccess: (state:cloneInitState, { payload }:{payload?:any}) => {
      state.isProductSuggestLoading = false;
      state.listProductSuggest = payload;
      state.pagingProductSuggest = {
        current : payload?.page,
        pageSize : payload?.limit,
        total: payload?.totalDocs,
        ...omit(payload,'docs','page','limit','totalDocs')
      }
      },
    getListProductSuggestFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isProductSuggestLoading = false;
      state.getProductSuggestFailed = payload;
    },
    updateSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.byId = payload?.data;
      state.list = state.list?.map((item:any) => get(item,'_id') === get(payload,'data._id') ? payload?.data : item);
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
      updateApplyLogisticRequest: (state:cloneInitState) => {
        state.isSubmitLoading = true;
        state.updateLogisticFailed = null;
      },
      updateApplyLogisticSuccess: (state: cloneInitState, { payload }: { payload: any }) => {
        state.isSubmitLoading = false;
        state.updateLogisticSuccess = payload;
        const bill = {
          ...payload?.data,
          fee: payload?.data?.fee?.map((item: any) => item?.typeFee === 'LOGISTIC' ? { ...item, value: payload?.data?.dataTransportUnit?.totalFee } : item)
        };
        state.byId = {
          ...state.byId,
          bill,
          fee: bill?.fee,
          feeDetail: {
            ...state?.byId?.feeDetail,
            LOGISTIC: payload?.data?.dataTransportUnit?.totalFee
          },
        };
      },
      updateApplyLogisticFailed: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.updateLogisticFailed = payload;
      },

      updateStatusAfterCheckWarehouseRequest: (state: cloneInitState, { payload }: { payload?: any }) => {
        state.byId = {
          ...state.byId,
          status: payload?.status,
          billItems: state.byId?.billItems?.map((item: any) => {
            const findItem = get(payload, 'data', []).find((billItem: any) => billItem?.variantId === item?.variantId && billItem?.productId === item?.productId);
            return {
              ...item,
              warehouseProductId: findItem?.warehouseProductId,
              warehouseVariantId: findItem?.warehouseVariantId,
              batchId: findItem?.batchId,
            }
          }),
        };
      
        // state.list = state.list?.map((item: any) => get(item, '_id') === get(payload, '_id') ? {
        //   ...item,
        //   status: payload?.status
        // } : item);
      },
    
    resetAction: (state:cloneInitState) => ({
      ...state,
      ...omit(this.cloneInitState, ["list"]),
    }),
    resetActionLogistic: (state:cloneInitState) => ({
      ...state,
      ...omit(this.cloneInitState, ["list",'byId']),
    }),
    };

    this.cloneInitState = {
      ...this.initialState,
      isGetDebtLoading : false,
      getDebtFailed : null,
      debt : null,
      updateBillItemFailed : null,
      updateBillItemSuccess : null,
      
      listProductSuggest: [],
      isProductSuggestLoading: false,
      getProductSuggestFailed: null,

      updateLogisticSuccess: null,
      updateLogisticFailed: null,
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
