import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../lk.api'; 
import { lkActions } from './reducer';

function* getListLk({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(lkActions.getListSuccess(data));
  } catch (error:any) {
    yield put(lkActions.getListFailed(error));
  }
}

function* getByIdLk({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(lkActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(lkActions.getByIdFailed(error));
  }
}

function* createLk({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(lkActions.createSuccess(data));
  } catch (error:any) {
    yield put(lkActions.createFailed(error));
  }
}

function* updateLk({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(lkActions.updateSuccess(data));
  } catch (error:any) {
    yield put(lkActions.updateFailed(error));
  }
}
function* deleteLk({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(lkActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(lkActions.deleteFailed(error));
  }
}


export default function* lkSaga() {
  yield takeLatest(lkActions.getListRequest, getListLk);
  yield takeLatest(lkActions.getByIdRequest, getByIdLk);
  yield takeLatest(lkActions.createRequest, createLk);
  yield takeLatest(lkActions.updateRequest, updateLk);
  yield takeLatest(lkActions.deleteRequest, deleteLk);
}
