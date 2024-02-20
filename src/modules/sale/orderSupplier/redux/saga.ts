import { get } from 'lodash';
import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../orderSupplier.api'; 
import { orderSupplierActions } from './reducer';

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
        code : get(data,'code')
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
// function* deleteOrderSupplier({payload : id} : any) : any {
//   try {
//     const data = yield call(api.delete,id);
//     yield put(orderSupplierActions.deleteSuccess(data));
//   } catch (error:any) {
//     yield put(orderSupplierActions.deleteFailed(error));
//   }
// }


export default function* orderSupplierSaga() {
  yield takeLatest(orderSupplierActions.getListRequest, getListOrderSupplier);
  yield takeLatest(orderSupplierActions.getByIdRequest, getByIdOrderSupplier);
  yield takeLatest(orderSupplierActions.createRequest, createOrderSupplier);
  yield takeLatest(orderSupplierActions.updateRequest, updateOrderSupplier);
  // yield takeLatest(orderSupplierActions.deleteRequest, deleteOrderSupplier);
}
