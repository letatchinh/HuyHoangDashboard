import { createSlice } from "@reduxjs/toolkit";
import { get, omit } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getPaging } from "~/utils/helpers";
 interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  listBorrow?: any[];
  getListBorrowFailed?: any;
   pagingBorrow?: any;
   
   stock?: any[];
  getStockFailed?: any;
  pagingStock?: any;

  byIdBorrow?: any;
  getByIdBorrowFailed?: any;
  createBorrowSuccess?: any;
  createBorrowFailed?: any;

  updateBorrowSuccess?: any;
  updateBorrowFailed?: any;

  deleteBorrowSuccess?: any;
   deleteBorrowFailed?: any;
   
   confirmSuccess?: any;
   confirmFailed?: any;

};

class ProductClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('product');
    this.cloneReducer = {
      ...this.initReducer,
      getListSuccess: (state:cloneInitState , { payload }: any) => {
        state.isLoading = false;
        // Find Variant Default
        const list = get(payload, "docs", [])?.map((item:any) => {
          const variant = get(item,'variants',[])?.find((v: any) => get(v,'variantIsDefault'));
          return {...item, variant,variantDefault : variant};
        });
        state.list = list;
        state.paging = getPaging(payload);
      },
      changeVariantDefault: (state:cloneInitState , { payload }: any) => {
        const {productId, variantId} = payload;
        const list = state.list?.map((item:any) => {
          if(get(item,'_id') === productId){ // Find Item
            const variant = get(item,'variants',[])?.find((v: any) => get(v,'_id') === variantId);
            return {...item, variant};
          }
          return item;
        });
        state.list = list;
      },
      resetActionFullState: (state:cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, ["list"]),
      }),

      updateSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.byId = payload;
        state.list = state.list?.map((item:any) => get(item,'_id') === get(payload,'data._id') ? {...item,...get(payload,'data')} : item);
        state.updateSuccess = payload;
      },
      getListBorrowRequest: (state:cloneInitState , { payload }: any) => {
        state.isLoading = true;
      },
      getListBorrowSuccess: (state:cloneInitState , { payload }: any) => {
        state.isLoading = false;
        state.listBorrow = get(payload, "docs", []);
        state.pagingBorrow = getPaging(payload);
      },
      getListBorrowFailed: (state:cloneInitState , { payload }: any) => {
        state.isLoading = false;
        state.listBorrow = [];
        state.pagingBorrow = undefined;
        state.getListBorrowFailed = payload;
      },

      
      getByIdBorrowRequest: (state:cloneInitState , { payload }: any) => {
        state.isGetByIdLoading = true;
      },
      getByIdBorrowSuccess: (state: cloneInitState, { payload }: any) => {
        state.isGetByIdLoading = false;
        state.byIdBorrow = payload;
      },
      getByIdBorrowFailed: (state:cloneInitState , { payload }: any) => {
        state.isGetByIdLoading = false;
        state.getByIdBorrowFailed = payload;
      },

      createBorrowRequest: (state:cloneInitState) => {
        state.isSubmitLoading = true;
        state.createBorrowFailed = null;
      },
      createBorrowSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.createBorrowSuccess = payload;
      },
      createBorrowFailed: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.createBorrowFailed = payload;
      },
  
      // Update
      updateBorrowRequest: (state:cloneInitState) => {
        state.isSubmitLoading = true;
        state.updateBorrowFailed = null;
      },
      updateBorrowSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.byIdBorrow = payload;
        state.listBorrow = state.list?.map((item:any) => get(item,'_id') === get(payload,'_id') ? payload : item);
        state.updateBorrowSuccess = payload;
      },
      updateBorrowFailed: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.updateBorrowFailed = payload;
      },

      // delete
    deleteBorrowRequest: (state:cloneInitState) => {
      state.isSubmitLoading = true;
      state.deleteBorrowFailed = null;
    },
    deleteBorrowSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.deleteBorrowSuccess = payload;
    },
    deleteBorrowFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.deleteBorrowFailed = payload;
      },
      resetActionProductBorrow: (state:cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, ["listBorrow", "pagingBorrow"]),
      }),

      confirmBorrowRequest: (state:cloneInitState) => {
        state.isSubmitLoading = true;
        state.confirmFailed = null;
      },
      confirmBorrowSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.confirmSuccess = payload;
      },
      confirmBorrowFailed: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.confirmFailed = payload;
      },

      //-----BORROW_PRODUCT-----

      getStockRequest: (state:cloneInitState , { payload }: any) => {
        state.isGetByIdLoading = true;
      },
      getStockSuccess: (state: cloneInitState, { payload }: any) => {
        state.isGetByIdLoading = false;
        state.stock = payload;
      },
      getStockFailed: (state:cloneInitState , { payload }: any) => {
        state.isGetByIdLoading = false;
        state.getStockFailed = payload;
      },
      resetAction: (state:cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, [ "list", "paging","listBorrow", "pagingBorrow"]),
      }),

      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...
      listBorrow: [],
      getListBorrowFailed: undefined,
      pagingBorrow: undefined,

      byIdBorrow: undefined,
      getByIdBorrowFailed: undefined,

      createBorrowSuccess: undefined,
      createBorrowFailed: undefined,

      updateBorrowSuccess: undefined,
      updateBorrowFailed: undefined,

      deleteBorrowSuccess: undefined,
      deleteBorrowFailed: undefined,

      confirmSuccess: undefined,
      confirmFailed: undefined,

      stock: [],
      getStockFailed: undefined,
      pagingStock: undefined,

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