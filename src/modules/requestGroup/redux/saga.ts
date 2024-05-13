import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../requestGroup.api'; 
import { requestGroupActions } from './reducer';

function* getListRequestGroup({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(requestGroupActions.getListSuccess(data));
  } catch (error:any) {
    yield put(requestGroupActions.getListFailed(error));
  }
}

function* getByIdRequestGroup({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(requestGroupActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(requestGroupActions.getByIdFailed(error));
  }
}

function* createRequestGroup({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(requestGroupActions.createSuccess(data));
  } catch (error:any) {
    yield put(requestGroupActions.createFailed(error));
  }
}

function* updateRequestGroup({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(requestGroupActions.updateSuccess(data));
  } catch (error:any) {
    yield put(requestGroupActions.updateFailed(error));
  }
}
function* deleteRequestGroup({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(requestGroupActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(requestGroupActions.deleteFailed(error));
  }
}


export default function* requestGroupSaga() {
  yield takeLatest(requestGroupActions.getListRequest, getListRequestGroup);
  yield takeLatest(requestGroupActions.getByIdRequest, getByIdRequestGroup);
  yield takeLatest(requestGroupActions.createRequest, createRequestGroup);
  yield takeLatest(requestGroupActions.updateRequest, updateRequestGroup);
  yield takeLatest(requestGroupActions.deleteRequest, deleteRequestGroup);
}
