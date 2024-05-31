import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../reportGroup.api'; 
import { reportGroupActions } from './reducer';

function* getListReportGroup({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(reportGroupActions.getListSuccess(data));
    yield put(reportGroupActions.clearAction());
  } catch (error:any) {
    yield put(reportGroupActions.getListFailed(error));
  }
}

function* getByIdReportGroup({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(reportGroupActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(reportGroupActions.getByIdFailed(error));
  }
}

function* createReportGroup({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(reportGroupActions.createSuccess(data));
  } catch (error:any) {
    yield put(reportGroupActions.createFailed(error));
  }
}

function* updateReportGroup({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(reportGroupActions.updateSuccess(data));
  } catch (error:any) {
    yield put(reportGroupActions.updateFailed(error));
  }
}
function* deleteReportGroup({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(reportGroupActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(reportGroupActions.deleteFailed(error));
  }
}


export default function* reportGroupSaga() {
  yield takeLatest(reportGroupActions.getListRequest, getListReportGroup);
  yield takeLatest(reportGroupActions.getByIdRequest, getByIdReportGroup);
  yield takeLatest(reportGroupActions.createRequest, createReportGroup);
  yield takeLatest(reportGroupActions.updateRequest, updateReportGroup);
  yield takeLatest(reportGroupActions.deleteRequest, deleteReportGroup);
}
