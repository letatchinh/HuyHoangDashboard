import { get } from 'lodash';
import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../orderSupplier.api'; 
import { orderSupplierActions } from './reducer';
import OrderItemModule from "~/modules/sale/orderSupplier/OrderItem"

function* getListOrderSupplier({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(orderSupplierActions.getListSuccess(data));
  } catch (error:any) {
    yield put(orderSupplierActions.getListFailed(error));
  }
}

function* getByIdOrderSupplier({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(orderSupplierActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(orderSupplierActions.getByIdFailed(error));
  }
}

function* createOrderSupplier({payload} : any) : any {
  try {
    const {callbackSubmit,...params} = payload
    const data = yield call(api.create,params);
    if(callbackSubmit){
      callbackSubmit({
        type : 'createOrderSupplier',
        code: get(data, 'code'),
        oldData: {...params, billId: get(data, '_id')},
      })
    }
    yield put(orderSupplierActions.createSuccess(data));
  } catch (error:any) {
    yield put(orderSupplierActions.createFailed(error));
  }
}

function* updateOrderSupplier({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(orderSupplierActions.updateSuccess(data));
  } catch (error:any) {
    yield put(orderSupplierActions.updateFailed(error));
  }
}

function* updateOrderItem({ payload }: any): any {
  try {
    const { callbackSubmit, ...query } = payload;
    const data = yield call(OrderItemModule.api.update, query);
    yield put(orderSupplierActions.updateOrderItemSuccess(data));
    if (callbackSubmit && typeof callbackSubmit === "function") {
      callbackSubmit();
    }
  } catch (error: any) {
    yield put(orderSupplierActions.updateOrderItemFailed(error));
  }
}
// function* deleteOrderSupplier({payload : id} : any) : any {
//   try {
//     const data = yield call(api.delete,id);
//     yield put(orderSupplierActions.deleteSuccess(data));
//   } catch (error:any) {
//     yield put(orderSupplierActions.deleteFailed(error));
//   }
// }
function* createOrderInWarehouse({ payload }: any): any {
  const { callbackSubmit, ...query } = payload;
  try {
    const data = yield call(api.createBillInWarehouse, query);
    if(callbackSubmit && typeof callbackSubmit === "function"){
      callbackSubmit(data);
    };
    yield put(orderSupplierActions.createOrderInWarehouseSuccess(data));
  } catch (error:any) {
    yield put(orderSupplierActions.createOrderInWarehouseFailed(error));
  }
}

function* updateStatusOrder({ payload }: any): any {
  try {
    const { callbackSubmit, ...query } = payload;
    const data = yield call(api.updateStatusBillWarehouse, query);
    yield put(orderSupplierActions.updateStatusOrderSuccess(data));
    if (callbackSubmit && typeof callbackSubmit === "function") {
      callbackSubmit();
    };
  } catch (error: any) {
    yield put(orderSupplierActions.updateStatusOrderFailed(error));
  }
};

export default function* orderSupplierSaga() {
  yield takeLatest(orderSupplierActions.getListRequest, getListOrderSupplier);
  yield takeLatest(orderSupplierActions.getByIdRequest, getByIdOrderSupplier);
  yield takeLatest(orderSupplierActions.createRequest, createOrderSupplier);
  yield takeLatest(orderSupplierActions.updateRequest, updateOrderSupplier);
  yield takeLatest(orderSupplierActions.updateStatusOrderRequest, updateStatusOrder);
  yield takeLatest(orderSupplierActions.updateOrderItemRequest, updateOrderItem);
  yield takeLatest(orderSupplierActions.createOrderInWarehouseRequest, createOrderInWarehouse);
}
