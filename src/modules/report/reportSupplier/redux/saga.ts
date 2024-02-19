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

function* createReportSupplier({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(reportSupplierSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(reportSupplierSliceAction.createFailed(error));
  }
}

function* updateReportSupplier({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(reportSupplierSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(reportSupplierSliceAction.updateFailed(error));
  }
}
function* deleteReportSupplier({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(reportSupplierSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(reportSupplierSliceAction.deleteFailed(error));
  }
}


export default function* reportSupplierSaga() {
  yield takeLatest(reportSupplierSliceAction.getListRequest, getListReportSupplier);
  yield takeLatest(reportSupplierSliceAction.getByIdRequest, getByIdReportSupplier);
  yield takeLatest(reportSupplierSliceAction.createRequest, createReportSupplier);
  yield takeLatest(reportSupplierSliceAction.updateRequest, updateReportSupplier);
  yield takeLatest(reportSupplierSliceAction.deleteRequest, deleteReportSupplier);
}
