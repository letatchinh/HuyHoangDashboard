import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../warehouse.api'; 
import { warehouseActions } from './reducer';
import { billSliceAction } from '~/modules/sale/bill/redux/reducer';
import { STATUS_BILL } from '~/modules/sale/bill/constants';
import { get, omit } from 'lodash';
import { branchSliceAction } from '~/modules/branch/redux/reducer';

function* getListWarehouse({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(warehouseActions.getListSuccess(data));
    yield put(warehouseActions.clearAction());
  } catch (error:any) {
    yield put(warehouseActions.getListFailed(error));
  }
}

function* getWarehouseDefault({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(warehouseActions.getWarehouseDefaultSuccess(data));
  } catch (error:any) {
    yield put(warehouseActions.getWarehouseDefaultFailed(error));
  }
};

function* getByIdWarehouseLinked({payload:id} : any) : any {
  try {
    const data = yield call(api.getAllWarehouse, id);
    yield put(warehouseActions.getWarehouseLinkedSuccess(data));
  } catch (error:any) {
    yield put(warehouseActions.getWarehouseLinkedFailed(error));
  }
};

function* createWarehouse({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(warehouseActions.createSuccess(data));
  } catch (error:any) {
    yield put(warehouseActions.createFailed(error));
  }
};

function* createBillToWarehouse({ payload }: any): any {
  try {
    const res = yield call(api.createBillToWarehouse,omit(payload, ['callback','status']));
    yield put(warehouseActions.createBillToWarehouseSuccess(res));
    if (typeof get(payload, 'callback', '') === 'function' && !res?.status) { // Thực thi khi kiểm kho có hàng bằng hình thức action trực tiếp trạng thái
      setTimeout(() => {
        payload.callback({
          status: payload?.status,
          billId: payload?.billId
        });
      }, 1000);
    } else {
      const data = {status: STATUS_BILL.REQUESTED, _id: payload?.billId}// Hành động theo thứ tự kiểm kho trong bộ thao tác
      yield put(billSliceAction.updateRequest(data));
    };
  } catch (error:any) {
    yield put(warehouseActions.createBillToWarehouseFailed(error));
  }
};

function* checkWarehouse({ payload }: any): any {
  try {
    const data = yield call(api.checkWarehouse, omit(payload, ['callback', 'status', 'bill']));
    if (!data?.status) {
      yield put(warehouseActions.checkWarehouseFailed(data));
      const newData = {status: 'UNREADY', _id: data?.billId, warehouseId: data?.warehouseId}
      yield put(billSliceAction.updateStatusAfterCheckWarehouseRequest(newData as any));
      yield put(billSliceAction.updateBillAfterCheckWarehouseRequest(data)); // Đổi lại trạng thái từng sản phẩm được mang đi kiểm kho sau khi kiểm kho
    } else {
      yield put(warehouseActions.checkWarehouseSuccess(data));
      yield put(billSliceAction.updateStatusAfterCheckWarehouseRequest({
        ...data,
        status: STATUS_BILL.READY,
        _id: data?.billId,
        warehouseId: data?.warehouseId,
      }));
      if (typeof get(payload, 'callback') === 'function' && data?.historyStatus === STATUS_BILL.READY) { // Thực thi khi kiểm kho có hàng
        payload.callback(payload?.status, payload?.bill);
      };
      yield put(billSliceAction.updateBillAfterCheckWarehouseRequest(data)); // Đổi lại trạng thái từng sản phẩm được mang đi kiểm kho sau khi kiểm kho
    };
  } catch (error: any) {
    console.log(error,'error')
    yield put(warehouseActions.checkWarehouseFailed(error?.response?.data));
  }
};

function* updateWarehouse({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(warehouseActions.updateSuccess(data));
  } catch (error:any) {
    yield put(warehouseActions.updateFailed(error));
  }
};

function* updateManagementWarehouse({payload} : any) : any {
  try {
    const data = yield call(api.updateManagementWarehouse, payload);
    yield put(warehouseActions.updateManagementWarehouseSuccess(data));
    yield put(warehouseActions.getWarehouseDefaultRequest(data?.data?._id));
  } catch (error:any) {
    yield put(warehouseActions.updateManagementWarehouseFailed(error));
  }
};

function* deleteWarehouse({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(warehouseActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(warehouseActions.deleteFailed(error));
  }
};

function* deleteWarehouseLinked({payload : id} : any) : any {
  try {
    const data = yield call(api.deleteWarehouseLink,id);
    yield put(warehouseActions.deleteWarehouseLinkedSuccess(data));
    yield put(branchSliceAction.getListRequest());
    yield put(warehouseActions.getListRequest());
  } catch (error:any) {
    yield put(warehouseActions.deleteWarehouseLinkedFailed(error));
  }
};

function* getInventory({payload:query} : any) : any {
  try {
    const data = yield call(api.getInventory,query);
    yield put(warehouseActions.getInventorySuccess(data));
  } catch (error:any) {
    yield put(warehouseActions.getInventoryFailed(error));
  }
};

function* getInventoryCreate({payload:query} : any) : any {
  try {
    const data = yield call(api.getInventory,query);
    yield put(warehouseActions.getInventoryInCreateSuccess(data));
  } catch (error:any) {
    yield put(warehouseActions.getInventoryInCreateFailed(error));
  }
};

export default function* warehouseSaga() {
  yield takeLatest(warehouseActions.getListRequest, getListWarehouse);
  yield takeLatest(warehouseActions.getWarehouseDefaultRequest, getWarehouseDefault);
  yield takeLatest(warehouseActions.createRequest, createWarehouse);
  yield takeLatest(warehouseActions.updateRequest, updateWarehouse);
  yield takeLatest(warehouseActions.deleteRequest, deleteWarehouse);
  
  yield takeLatest(warehouseActions.createBillToWarehouseRequest, createBillToWarehouse);
  yield takeLatest(warehouseActions.updateManagementWarehouseRequest, updateManagementWarehouse);
  yield takeLatest(warehouseActions.getWarehouseLinkedRequest, getByIdWarehouseLinked);
  yield takeLatest(warehouseActions.checkWarehouseRequest, checkWarehouse);
  yield takeLatest(warehouseActions.deleteWarehouseLinkedRequest, deleteWarehouseLinked);
  yield takeLatest(warehouseActions.getInventoryRequest, getInventory);
  yield takeLatest(warehouseActions.getInventoryInCreateRequest, getInventoryCreate);
};
