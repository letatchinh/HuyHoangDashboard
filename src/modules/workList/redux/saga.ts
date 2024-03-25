import { get, omit } from 'lodash';
import { put, call, takeLatest, takeEvery } from 'redux-saga/effects';
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
    yield put(workListActions.getListBoardConfigRequest(payload.sprintId));
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
};
function* deleteWorkList({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(workListActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(workListActions.deleteFailed(error));
  }
};

function* getListWorkConfig({ payload: query }: any): any {
  // console.log("first")
  try {
    const data = yield call(api.getListWorkConfig, query);
    yield put(workListActions.getListBoardConfigSuccess(data));
  
    for (const res of data) {
      const dataType: any = { id: get(res, '_id', ''), ...omit(query, ['sprintId']) };
      yield put(workListActions.addBoardConfigItemRequest(dataType));
    }
  } catch (error: any) {
    yield put(workListActions.getListBoardConfigFailed(error));
  }
  
}
function* getBoardConfigItem({ payload }: any): any {
  try {
    const res = yield call(api.getAllTask, payload);
    const dataType: any = { id: payload.id, data: res };
    yield put(workListActions.addBoardConfigItemSuccess(dataType));
  } catch (error: any) {
    yield put(workListActions.addBoardConfigItemFaled(error));
  }
};
export default function* workListSaga() {
  yield takeLatest(workListActions.getListRequest, getListWorkList);
  yield takeLatest(workListActions.getByIdRequest, getByIdWorkList);
  yield takeLatest(workListActions.createRequest, createWorkList);
  yield takeLatest(workListActions.updateRequest, updateWorkList);
  yield takeLatest(workListActions.deleteRequest, deleteWorkList);
  yield takeLatest(workListActions.getListBoardConfigRequest, getListWorkConfig);
  yield takeEvery(workListActions.addBoardConfigItemRequest, getBoardConfigItem);
}
