import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../workTask.api'; 
import { workTaskActions } from './reducer';

function* getListWorkTask({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(workTaskActions.getListSuccess(data));
  } catch (error:any) {
    yield put(workTaskActions.getListFailed(error));
  }
}

function* getByIdWorkTask({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(workTaskActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(workTaskActions.getByIdFailed(error));
  }
}

function* createWorkTask({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(workTaskActions.createSuccess(data));
  } catch (error:any) {
    yield put(workTaskActions.createFailed(error));
  }
}

function* updateWorkTask({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(workTaskActions.updateSuccess(data));
  } catch (error:any) {
    yield put(workTaskActions.updateFailed(error));
  }
}
function* deleteWorkTask({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(workTaskActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(workTaskActions.deleteFailed(error));
  }
}


export default function* workTaskSaga() {
  yield takeLatest(workTaskActions.getListRequest, getListWorkTask);
  yield takeLatest(workTaskActions.getByIdRequest, getByIdWorkTask);
  yield takeLatest(workTaskActions.createRequest, createWorkTask);
  yield takeLatest(workTaskActions.updateRequest, updateWorkTask);
  yield takeLatest(workTaskActions.deleteRequest, deleteWorkTask);
}
