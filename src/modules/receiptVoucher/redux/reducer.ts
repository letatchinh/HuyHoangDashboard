import { createSlice } from "@reduxjs/toolkit";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import{get, omit} from 'lodash'
import { getPaging } from "~/utils/helpers";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  confirmSuccess?: any,
  confirmFailed?: any

  listByBillId?: any,
  isLoadingBillId?: boolean,
  getListByBillIdFailed?: any,
  pagingByBillId?: any
};
class ReceiptVoucherClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('receiptVoucher');
    this.cloneReducer = {
      ...this.initReducer,
      confirmReceiptVoucherRequest: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = true;
      },
      confirmReceiptVoucherSuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.confirmSuccess = payload?.data;
        state.list = state.list?.map((item: any) => {
          if (item._id === payload?.data?._id) {
            return { ...item, ...payload?.data };
          }
          return item
        });
      },
      confirmReceiptVoucherFailed: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.confirmFailed = payload;
      },

      updateSuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading = false;
        state.list = state.list?.map((item: any) => {
          if (item._id === payload?.data?._id) {
            return {...item, ...payload?.data};
          }
          return item
        });
        state.updateSuccess = payload?.data;
      },
      resetAction: (state:cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, ["list, listByBillId, pagingByBillId"]),
      }),

        // Get List By Bill Id
      getListByBillIdRequest: (state:cloneInitState) => {
        state.isLoadingBillId = true;
        state.getListByBillIdFailed = null;
      },
      getListByBillIdSuccess: (state:cloneInitState , { payload }: any) => {
        state.isLoadingBillId = false;
        state.listByBillId = payload;
        state.pagingByBillId = getPaging(payload);
      },
      getListByBillIdFailed: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isLoadingBillId = false;
        state.getListByBillIdFailed = payload;
      },
      // Want Add more reducer Here...
      
    }
    this.cloneInitState = {
      ...this.initialState,
      confirmSuccess:  undefined,
      confirmFailed: undefined,
      
      //Bill Id

      listByBillId: [],
      isLoadingBillId: false,
      getListByBillIdFailed: undefined,
      pagingByBillId: undefined,
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

const newSlice = new ReceiptVoucherClassExtend();
const data = newSlice.createSlice();


export const receiptVoucherSliceAction = data.actions;
export default data.reducer;
