import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../reportEmployee.api'; 
import { reportEmployeeActions } from './reducer';

function* getListReportEmployee({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(reportEmployeeActions.getListSuccess(data));
  } catch (error:any) {
    yield put(reportEmployeeActions.getListFailed(error));
  }
}

function* getByIdReportEmployee({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(reportEmployeeActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(reportEmployeeActions.getByIdFailed(error));
  }
}

function* createReportEmployee({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(reportEmployeeActions.createSuccess(data));
  } catch (error:any) {
    yield put(reportEmployeeActions.createFailed(error));
  }
}

function* updateReportEmployee({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(reportEmployeeActions.updateSuccess(data));
  } catch (error:any) {
    yield put(reportEmployeeActions.updateFailed(error));
  }
}

function* updatePreviewReportEmployee({payload} : any) : any {
  try {
    const data = yield call(api.updatePreview,payload);
    yield put(reportEmployeeActions.updatePreviewSuccess(data));
  } catch (error:any) {
    yield put(reportEmployeeActions.updatePreviewFailed(error));
  }
}

function* updateStatusReportEmployee({payload} : any) : any {
  try {
    const data = yield call(api.updateStatus,payload);
    yield put(reportEmployeeActions.updateStatusSuccess(data));
  } catch (error:any) {
    yield put(reportEmployeeActions.updateStatusFailed(error));
  }
}

function* deleteReportEmployee({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(reportEmployeeActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(reportEmployeeActions.deleteFailed(error));
  }
}


export default function* reportEmployeeSaga() {
  yield takeLatest(reportEmployeeActions.getListRequest, getListReportEmployee);
  yield takeLatest(reportEmployeeActions.getByIdRequest, getByIdReportEmployee);
  yield takeLatest(reportEmployeeActions.createRequest, createReportEmployee);
  yield takeLatest(reportEmployeeActions.updateRequest, updateReportEmployee);
  yield takeLatest(reportEmployeeActions.updatePreviewRequest, updatePreviewReportEmployee);
  yield takeLatest(reportEmployeeActions.updateStatusRequest, updateStatusReportEmployee);
  yield takeLatest(reportEmployeeActions.deleteRequest, deleteReportEmployee);
}
