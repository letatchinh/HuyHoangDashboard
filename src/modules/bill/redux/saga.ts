import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../bill.api'; 
import { billActions } from './reducer';

function* getListBill({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(billActions.getListSuccess(data));
  } catch (error:any) {
    yield put(billActions.getListFailed(error));
  }
}

function* getByIdBill({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(billActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(billActions.getByIdFailed(error));
  }
}

function* createBill({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(billActions.createSuccess(data));
  } catch (error:any) {
    yield put(billActions.createFailed(error));
  }
}

function* updateBill({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(billActions.updateSuccess(data));
  } catch (error:any) {
    yield put(billActions.updateFailed(error));
  }
}
function* deleteBill({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(billActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(billActions.deleteFailed(error));
  }
}


export default function* billSaga() {
  yield takeLatest(billActions.getListRequest, getListBill);
  yield takeLatest(billActions.getByIdRequest, getByIdBill);
  yield takeLatest(billActions.createRequest, createBill);
  yield takeLatest(billActions.updateRequest, updateBill);
  yield takeLatest(billActions.deleteRequest, deleteBill);
}
