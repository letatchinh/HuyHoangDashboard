import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../Lk.api'; 
import { LkActions } from './reducer';

function* getListLk({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(LkActions.getListSuccess(data));
  } catch (error:any) {
    yield put(LkActions.getListFailed(error));
  }
}

function* getByIdLk({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(LkActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(LkActions.getByIdFailed(error));
  }
}

function* createLk({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(LkActions.createSuccess(data));
  } catch (error:any) {
    yield put(LkActions.createFailed(error));
  }
}

function* updateLk({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(LkActions.updateSuccess(data));
  } catch (error:any) {
    yield put(LkActions.updateFailed(error));
  }
}
function* deleteLk({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(LkActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(LkActions.deleteFailed(error));
  }
}


export default function* LkSaga() {
  yield takeLatest(LkActions.getListRequest, getListLk);
  yield takeLatest(LkActions.getByIdRequest, getByIdLk);
  yield takeLatest(LkActions.createRequest, createLk);
  yield takeLatest(LkActions.updateRequest, updateLk);
  yield takeLatest(LkActions.deleteRequest, deleteLk);
}
