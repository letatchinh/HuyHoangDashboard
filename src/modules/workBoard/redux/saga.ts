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

function* getAllManagers({payload:query} : any) : any {
  try {
    const data = yield call(api.getAllManagers,query);
    yield put(workBoardActions.getAllManagersSuccess(data));
  } catch (error:any) {
    yield put(workBoardActions.getAllManagersFailed(error));
  }
}
function* getAllEmployee({payload:query} : any) : any {
  try {
    const data = yield call(api.getAllEmployee,query);
    yield put(workBoardActions.getAllEmployeeSuccess(data));
  } catch (error:any) {
    yield put(workBoardActions.getAllEmployeeFailed(error));
  }
}
function* getListBoard ({payload:query} : any) : any {
  try {
    const data = yield call(api.getListBoard,query);
    yield put(workBoardActions.getListBoardSuccess(data));
  } catch (error:any) {
    yield put(workBoardActions.getListBoardFailed(error));
  }
}
function* getListManagerById ({payload:id} : any) : any {
  try {
    const data = yield call(api.getAllManagersByIdBoard,id);
    yield put(workBoardActions.getListManagerByIdSuccess(data));
  } catch (error:any) {
    yield put(workBoardActions.getListManagerByIdFailed(error));
  }
}
function* getListEmployeeById ({payload:id} : any) : any {
  try {
    const data = yield call(api.getAllEmployeeByIdBoard,id);
    yield put(workBoardActions.getListEmployeeByIdSuccess(data));
  } catch (error:any) {
    yield put(workBoardActions.getListEmployeeByIdFailed(error));
  }
}
export default function* workBoardSaga() {
  yield takeLatest(workBoardActions.getListRequest, getListWorkBoard);
  yield takeLatest(workBoardActions.getByIdRequest, getByIdWorkBoard);
  yield takeLatest(workBoardActions.createRequest, createWorkBoard);
  yield takeLatest(workBoardActions.updateRequest, updateWorkBoard);
  yield takeLatest(workBoardActions.deleteRequest, deleteWorkBoard);
  yield takeLatest(workBoardActions.getAllManagersRequest, getAllManagers);
  yield takeLatest(workBoardActions.getAllEmployeeRequest, getAllEmployee);
  yield takeLatest(workBoardActions.getListBoardRequest, getListBoard);   
  yield takeLatest(workBoardActions.getListManagerByIdRequest, getListManagerById);
  yield takeLatest(workBoardActions.getListEmployeeByIdRequest, getListEmployeeById);                          
}
