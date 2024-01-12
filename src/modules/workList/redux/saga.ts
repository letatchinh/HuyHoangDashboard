import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../workList.api'; 
import { workListActions } from './reducer';

function* getListWorkList({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(workListActions.getListSuccess(data));
  } catch (error:any) {
    yield put(workListActions.getListFailed(error));
  }
}

function* getByIdWorkList({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(workListActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(workListActions.getByIdFailed(error));
  }
}

function* createWorkList({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(workListActions.createSuccess(data));
  } catch (error:any) {
    yield put(workListActions.createFailed(error));
  }
}

function* updateWorkList({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(workListActions.updateSuccess(data));
  } catch (error:any) {
    yield put(workListActions.updateFailed(error));
  }
}
function* deleteWorkList({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(workListActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(workListActions.deleteFailed(error));
  }
}


export default function* workListSaga() {
  yield takeLatest(workListActions.getListRequest, getListWorkList);
  yield takeLatest(workListActions.getByIdRequest, getByIdWorkList);
  yield takeLatest(workListActions.createRequest, createWorkList);
  yield takeLatest(workListActions.updateRequest, updateWorkList);
  yield takeLatest(workListActions.deleteRequest, deleteWorkList);
}
