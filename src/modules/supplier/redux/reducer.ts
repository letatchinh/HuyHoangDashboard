import { createSlice } from "@reduxjs/toolkit";
import { get ,omit} from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { getPaging } from "~/utils/helpers";
import { cloneInitState } from "../supplier.modal";

class SupplierClassExtend extends InstanceModuleRedux {
  clone;
  cloneInitState: cloneInitState;
  constructor() {
    super("supplier");
    this.clone = {
      ...this.initReducer,
      // Add More Reducer
      getProductSupplierRequest: (state: any) => {
        state.isLoadingGetProductSupplier = true;
        state.getProductSupplierFailed = null;
        state.totalAmountOrder = 0;
      },
      getProductSupplierSuccess: (state: any, { payload }: any) => {
        state.isLoadingGetProductSupplier = false;
        state.productSupplier = get(payload, "docs", []);
        state.pagingProductSupplier = getPaging(payload);
        state.totalAmountOrder = get(payload, "totalAmountOrder", 0);
      },
      getProductSupplierFailed: (state: any, { payload }: any) => {
        state.isLoadingGetProductSupplier = false;
        state.getProductSupplierFailed = payload;
        state.totalAmountOrder = 0;
      },
      getVoucherSupplierRequest: (state: any) => {
        state.isLoadingGetVoucherSupplier = true;
        state.getVoucherSupplierFailed = null;
      },
      getVoucherSupplierSuccess: (state: any, { payload }: any) => {
        state.isLoadingGetVoucherSupplier = false;
        state.voucherSupplier = get(payload, "docs", []);
        state.pagingVoucherSupplier = getPaging(payload);
      },
      getVoucherSupplierFailed: (state: any, { payload }: any) => {
        state.isLoadingGetVoucherSupplier = false;
        state.getVoucherSupplierFailed = payload;
      },
      getSuppliersProductAuthorRequest: (state: any) => {
        state.isLoadingGetSuppliersProductAuthor = true;
        state.getSuppliersProductAuthorFailed = null;
      },
      getSuppliersProductAuthorSuccess: (state: any, { payload }: any) => {
        state.isLoadingGetSuppliersProductAuthor = false;
        state.suppliersProductAuthor = payload;
        state.pagingSuppliersProductAuthor = getPaging(payload);
      },
      getSuppliersProductAuthorFailed: (state: any, { payload }: any) => {
        state.isLoadingGetSuppliersProductAuthor = false;
        state.getSuppliersProductAuthorFailed = payload;
      },

      //Revenue Supplier
      getRevenueSupplierRequest: (state: cloneInitState) => {
        state.isLoadingGetRevenueSupplier = true;
        state.getRevenueSupplierFailed = null;
      },
      getRevenueSupplierSuccess: (state: cloneInitState, { payload }: any) => {
        state.isLoadingGetRevenueSupplier = false;
        state.revenueSupplier = payload;
        state.pagingRevenueSupplier = getPaging(payload);
      },
      getRevenueSupplierFailed: (state: cloneInitState, { payload }: any) => {
        state.isLoadingGetRevenueSupplier = false;
        state.getRevenueSupplierFailed = payload;
      },

      getTotalRevenueRequest: (state: cloneInitState) => {
        state.isLoadingGetTotalRevenue = true;
        state.getTotalRevenueFailed = null;
      },
      getTotalRevenueSuccess: (state: cloneInitState, { payload }: any) => {
        state.isLoadingGetTotalRevenue = false;
        state.totalRevenue = payload;
      },
      getTotalRevenueFailed: (state: cloneInitState, { payload }: any) => {
        state.isLoadingGetTotalRevenue = false;
        state.getTotalRevenueFailed = payload;
      },

      updateRevenueSupplierRequest: (state: cloneInitState) => {
        state.isLoadingSubmitRevenue = false;
      },
      updateRevenueSupplierSuccess: (state: cloneInitState, { payload }: any) => {
        state.updateRevenueSuccess = payload;
        state.revenueSupplier = state.revenueSupplier?.docs?.map((item: any) => {
          if (item._id === payload._id) {
            return payload;
          }
          return item;
        });
      },
      updateRevenueSupplierFailed: (state: cloneInitState, { payload }: any) => {
        state.updateRevenueFailed = payload;
      },
      //
      updateTotalRevenueSupplierRequest: (state: cloneInitState) => {
        state.isLoadingSubmitRevenue = false;
      },
      updateTotalRevenueSupplierSuccess: (state: cloneInitState, { payload }: any) => {
        state.updateTotalRevenueSuccess = payload;
        state.totalRevenue = payload;
      },
      updateTotalRevenueSupplierFailed: (state: cloneInitState, { payload }: any) => {
        state.updateTotalRevenueFailed = payload;
      },

      //
      createTotalRevenueRequest: (state: cloneInitState) => {
        state.isLoadingSubmitRevenue = false;
      },
      createTotalRevenueSuccess: (state: cloneInitState, { payload }: any) => {
        state.createTotalRevenueSuccess = payload;
        state.totalRevenue = payload;
      },
      createTotalRevenueFailed: (state: cloneInitState, { payload }: any) => {
        state.createTotalRevenueFailed = payload;
      },
      
      getListTotalRevenueRequest: (state: cloneInitState) => {
        state.isLoadingGetListTotalRevenue = true;
        state.getListTotalRevenueFailed = null;
      },
      getListTotalRevenueSuccess: (state: cloneInitState, { payload }: any) => {
        state.isLoadingGetListTotalRevenue = false;
        state.revenueListTotal = get(payload, "docs", []);
        state.pagingListTotalRevenue = getPaging(payload);
      },
      getListTotalRevenueFailed: (state: cloneInitState, { payload }: any) => {
        state.isLoadingGetListTotalRevenue = false;
        state.getListTotalRevenueFailed = payload;
      },

      setRevenueIdAction: (state: cloneInitState, { payload }: any) => {
        state.revenueId = payload;
      },

      resetActionInRevenue: (state:any) => ({
        ...state,
        ...omit(this.cloneInitState, ["revenueSupplier"]),  
      }),

      resetActionInTotalRevenue: (state:any) => ({
        ...state,
        ...omit(this.cloneInitState, ["revenueSupplier", "totalRevenue", 'revenueId']),  
      }),

    };
    // Add More InitState
    this.cloneInitState = {
      ...this.initialState,
      isLoadingGetProductSupplier: false,
      getProductSupplierFailed: null,
      productSupplier: [],
      // pagingProductSupplier: null,
      pagingProductSupplier: null,
      isLoadingGetSuppliersProductAuthor: false,
      suppliersProductAuthor: [],
      pagingSuppliersProductAuthor: null, 
      getSuppliersProductAuthorFailed: null, 
      
      isLoadingGetRevenueSupplier: false,
      revenueSupplier: [],
      getRevenueSupplierFailed: null,
      pagingRevenueSupplier: null,

      isLoadingGetTotalRevenue: false,
      totalRevenue: null,
      getTotalRevenueFailed: null,

      updateRevenueSuccess: null,
      updateRevenueFailed: null,

      updateTotalRevenueSuccess: null,
      updateTotalRevenueFailed: null,

      createTotalRevenueSuccess: null,
      createTotalRevenueFailed: null,

      isLoadingGetListTotalRevenue: false,
      getListTotalRevenueFailed: null,
      revenueListTotal: [],
      pagingListTotalRevenue: null,

      isLoadingSubmitRevenue: false,

      revenueId: null,
    };
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers: this.clone,
    });
  }
}

const newSlice = new SupplierClassExtend();
const data = newSlice.createSlice();


export const supplierSliceAction   = data.actions;
export default data.reducer;
