import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../workSprint.api'; 
import { workSprintActions } from './reducer';

function* getListWorkSprint({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(workSprintActions.getListSuccess(data));
  } catch (error:any) {
    yield put(workSprintActions.getListFailed(error));
  }
}

function* getByIdWorkSprint({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(workSprintActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(workSprintActions.getByIdFailed(error));
  }
}
function* getListTaskBySprint({payload} : any) : any {
  try {
    const data = yield call(api.getTaskInSprints,payload);
    yield put(workSprintActions.getListTaskBySprintSuccess(data));
  } catch (error:any) {
    yield put(workSprintActions.getListTaskBySprintFailed(error));
  }
}
function* createWorkSprint({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    console.log(data)
    yield put(workSprintActions.createSuccess(data));
  } catch (error:any) {
    yield put(workSprintActions.createFailed(error));
  }
}

function* updateWorkSprint({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(workSprintActions.updateSuccess(data));
  } catch (error:any) {
    yield put(workSprintActions.updateFailed(error));
  }
}
function* deleteWorkSprint({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(workSprintActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(workSprintActions.deleteFailed(error));
  }
}


export default function* workSprintSaga() {
  yield takeLatest(workSprintActions.getListRequest, getListWorkSprint);
  yield takeLatest(workSprintActions.getByIdRequest, getByIdWorkSprint);
  yield takeLatest(workSprintActions.createRequest, createWorkSprint);
  yield takeLatest(workSprintActions.updateRequest, updateWorkSprint);
  yield takeLatest(workSprintActions.deleteRequest, deleteWorkSprint);
  yield takeLatest(workSprintActions.getListTaskBySprintRequest, getListTaskBySprint);
}
