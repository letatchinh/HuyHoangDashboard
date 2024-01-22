import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../statusConfig.api'; 
import { statusConfigActions } from './reducer';

function* getListStatusConfig({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(statusConfigActions.getStatusConfigSuccess(data));
  } catch (error:any) {
    yield put(statusConfigActions.getStatusConfigFailed(error));
  }
}

function* getByIdStatusConfig({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(statusConfigActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(statusConfigActions.getByIdFailed(error));
  }
}

function* createStatusConfig({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(statusConfigActions.createSuccess(data));
  } catch (error:any) {
    yield put(statusConfigActions.createFailed(error));
  }
}

function* updateStatusConfig({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(statusConfigActions.updateSuccess(data));
  } catch (error:any) {
    yield put(statusConfigActions.updateFailed(error));
  }
}
function* deleteStatusConfig({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(statusConfigActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(statusConfigActions.deleteFailed(error));
  }
}


export default function* statusConfigSaga() {
  yield takeLatest(statusConfigActions.getStatusConfigRequest, getListStatusConfig);
  yield takeLatest(statusConfigActions.getByIdRequest, getByIdStatusConfig);
  yield takeLatest(statusConfigActions.createRequest, createStatusConfig);
  yield takeLatest(statusConfigActions.updateRequest, updateStatusConfig);
  yield takeLatest(statusConfigActions.deleteRequest, deleteStatusConfig);
}
