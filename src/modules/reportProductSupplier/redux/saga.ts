import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../reportProductSupplier.api'; 
import { reportProductSupplierActions } from './reducer';

function* getListReportProductSupplier({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(reportProductSupplierActions.getListSuccess(data));
  } catch (error:any) {
    yield put(reportProductSupplierActions.getListFailed(error));
  }
}

function* getByIdReportProductSupplier({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(reportProductSupplierActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(reportProductSupplierActions.getByIdFailed(error));
  }
}

function* createReportProductSupplier({payload} : any) : any {
  try {
    const data = yield call(api.getListChart,payload);
    yield put(reportProductSupplierActions.createSuccess(data));
  } catch (error:any) {
    yield put(reportProductSupplierActions.createFailed(error));
  }
}

function* updateReportProductSupplier({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(reportProductSupplierActions.updateSuccess(data));
  } catch (error:any) {
    yield put(reportProductSupplierActions.updateFailed(error));
  }
}
function* deleteReportProductSupplier({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(reportProductSupplierActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(reportProductSupplierActions.deleteFailed(error));
  }
}


export default function* reportProductSupplierSaga() {
  yield takeLatest(reportProductSupplierActions.getListRequest, getListReportProductSupplier);
  yield takeLatest(reportProductSupplierActions.getByIdRequest, getByIdReportProductSupplier);
  yield takeLatest(reportProductSupplierActions.createRequest, createReportProductSupplier);
  yield takeLatest(reportProductSupplierActions.updateRequest, updateReportProductSupplier);
  yield takeLatest(reportProductSupplierActions.deleteRequest, deleteReportProductSupplier);
}
