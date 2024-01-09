import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../workBoard.api'; 
import { workBoardActions } from './reducer';

function* getListWorkBoard({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(workBoardActions.getListSuccess(data));
  } catch (error:any) {
    yield put(workBoardActions.getListFailed(error));
  }
}

function* getByIdWorkBoard({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(workBoardActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(workBoardActions.getByIdFailed(error));
  }
}

function* createWorkBoard({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(workBoardActions.createSuccess(data));
  } catch (error:any) {
    yield put(workBoardActions.createFailed(error));
  }
}

function* updateWorkBoard({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(workBoardActions.updateSuccess(data));
  } catch (error:any) {
    yield put(workBoardActions.updateFailed(error));
  }
}
function* deleteWorkBoard({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(workBoardActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(workBoardActions.deleteFailed(error));
  }
}


export default function* workBoardSaga() {
  yield takeLatest(workBoardActions.getListRequest, getListWorkBoard);
  yield takeLatest(workBoardActions.getByIdRequest, getByIdWorkBoard);
  yield takeLatest(workBoardActions.createRequest, createWorkBoard);
  yield takeLatest(workBoardActions.updateRequest, updateWorkBoard);
  yield takeLatest(workBoardActions.deleteRequest, deleteWorkBoard);
}
