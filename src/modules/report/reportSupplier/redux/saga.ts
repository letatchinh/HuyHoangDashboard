import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../reportSupplier.api'; 
import { reportSupplierSliceAction } from './reducer';

function* getListReportSupplier({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(reportSupplierSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(reportSupplierSliceAction.getListFailed(error));
  }
}

function* getByIdReportSupplier({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(reportSupplierSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(reportSupplierSliceAction.getByIdFailed(error));
  }
}


export default function* reportSupplierSaga() {
  yield takeLatest(reportSupplierSliceAction.getListRequest, getListReportSupplier);
  yield takeLatest(reportSupplierSliceAction.getByIdRequest, getByIdReportSupplier);
}
