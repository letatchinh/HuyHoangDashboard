import { createSlice } from "@reduxjs/toolkit";
import { get, omit } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  updateOrderItemFailed?: any;
  updateOrderItemSuccess?: any;

  updateStatusOrderFailed?: any;
  updateStatusOrderSuccess?: any;

  createBillInWarehouseSuccess?: any;
  createBillInWarehouseFailed?: any;
}
class OrderSupplierClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState: cloneInitState;
  constructor() {
    super("orderSupplier");
    this.cloneReducer = {
      ...this.initReducer,
      // Want Add more reducer Here...
      getByIdSuccess: (
        state: initStateSlice,
        { payload }: { payload?: any }
      ) => {
        state.isGetByIdLoading = false;
        state.byId = get(payload, "[0]");
      },
      // update billItem
      updateOrderItemRequest: (state: cloneInitState) => {
        state.isSubmitLoading = true;
        state.updateOrderItemFailed = null;
      },
      updateOrderItemSuccess: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        const orderSupplierId = Object.keys(payload)?.[0];
        const payloadUpdate = get(payload, orderSupplierId, {});
        const orderItems = get(state.byId, "orderItems", [])?.map(
          (billItem: any) => {
            if (orderSupplierId === get(billItem, "_id")) {
              return {
                ...billItem,
                ...payloadUpdate,
              };
            }
            return billItem;
          }
        );
        state.byId = {
          ...state.byId,
          orderItems,
        };
        state.updateOrderItemSuccess = payload;
      },
      updateOrderItemFailed: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.updateOrderItemFailed = payload;
      },
      createOrderInWarehouseRequest: (state:cloneInitState) => {
        state.isSubmitLoading = true;
      },
      createOrderInWarehouseSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.createBillInWarehouseSuccess = payload;
        state.byId = get(payload, "[0]");
      },
      createOrderInWarehouseFailed: (state:cloneInitState, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        state.createBillInWarehouseFailed = payload;
      },
      resetAction: (state:cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, ["list",'paging']),
      }),

      updateStatusOrderRequest: (state: cloneInitState) => {
        state.isSubmitLoading = true;
      },
      updateStatusOrderSuccess: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        const orderSupplierId = Object.keys(payload)?.[0];
        const payloadUpdate = get(payload, orderSupplierId, {});
        const orderItems = get(state.byId, "orderItems", [])?.map(
          (billItem: any) => {
            if (orderSupplierId === get(billItem, "_id")) {
              return {
                ...billItem,
                ...payloadUpdate,
              };
            }
            return billItem;
          }
        );
        state.byId = {
          ...state.byId,
          orderItems,
        };
        state.updateStatusOrderSuccess = payload;
        state.list = state?.list?.map((item: any) => {
          if (payload?.data?._id === get(item, "_id")) {
            return {
              ...item,
              status: payload?.data?.status,
              statusPurchaseOrder: payload?.data?.statusPurchaseOrder
            };
          }
          return item;
        });
      },
      updateStatusOrderFailed: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.updateStatusOrderFailed = payload;
      },
      resetActionInById: (state:cloneInitState) => ({
        ...state,
        ...omit(this.cloneInitState, ["byId"]),
      }),
      updateByIdRedux: (state:cloneInitState, { payload }:{payload:any}) => {
        // state.byId = {
        //   ...state.byId,
        //   status: payload?.status
        // };
      }
    };

    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...
      updateOrderItemFailed: null,
      updateOrderItemSuccess: null,

      createBillInWarehouseSuccess: null,
      createBillInWarehouseFailed: null,

      updateStatusOrderFailed: null,
      updateStatusOrderSuccess: null,
    };
  }

  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers: this.cloneReducer,
    });
  }
}

const newSlice = new OrderSupplierClassExtend();
const data = newSlice.createSlice();

export const orderSupplierActions = data.actions;
export default data.reducer;
