import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../supplier.api'; 
import { supplierSliceAction } from './reducer';

function* getList({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(supplierSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.getListFailed(error));
  }
}

function* getById({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(supplierSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.getByIdFailed(error));
  }
}


export default function* supplierSaga() {
  yield takeLatest(supplierSliceAction.getListRequest, getList);
  yield takeLatest(supplierSliceAction.getByIdRequest, getById);
}
