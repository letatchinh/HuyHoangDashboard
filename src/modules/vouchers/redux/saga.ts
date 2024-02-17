import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../vouchers.api'; 
import { vouchersSliceAction } from './reducer';

function* getListVouchers({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(vouchersSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(vouchersSliceAction.getListFailed(error));
  }
}

function* getByIdVouchers({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(vouchersSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(vouchersSliceAction.getByIdFailed(error));
  }
}

function* createVouchers({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(vouchersSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(vouchersSliceAction.createFailed(error));
  }
}

function* updateVouchers({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(vouchersSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(vouchersSliceAction.updateFailed(error));
  }
}
function* deleteVouchers({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(vouchersSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(vouchersSliceAction.deleteFailed(error));
  }
}


export default function* vouchersSaga() {
  yield takeLatest(vouchersSliceAction.getListRequest, getListVouchers);
  yield takeLatest(vouchersSliceAction.getByIdRequest, getByIdVouchers);
  yield takeLatest(vouchersSliceAction.createRequest, createVouchers);
  yield takeLatest(vouchersSliceAction.updateRequest, updateVouchers);
  yield takeLatest(vouchersSliceAction.deleteRequest, deleteVouchers);
}
