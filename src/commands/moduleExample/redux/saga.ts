import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../moduleExample.api'; 
import { moduleExampleActions } from './reducer';

function* getListModuleExample({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(moduleExampleActions.getListSuccess(data));
    yield put(moduleExampleActions.clearAction());
  } catch (error:any) {
    yield put(moduleExampleActions.getListFailed(error));
  }
}

function* getByIdModuleExample({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(moduleExampleActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(moduleExampleActions.getByIdFailed(error));
  }
}

function* createModuleExample({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(moduleExampleActions.createSuccess(data));
  } catch (error:any) {
    yield put(moduleExampleActions.createFailed(error));
  }
}

function* updateModuleExample({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(moduleExampleActions.updateSuccess(data));
  } catch (error:any) {
    yield put(moduleExampleActions.updateFailed(error));
  }
}
function* deleteModuleExample({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(moduleExampleActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(moduleExampleActions.deleteFailed(error));
  }
}


export default function* moduleExampleSaga() {
  yield takeLatest(moduleExampleActions.getListRequest, getListModuleExample);
  yield takeLatest(moduleExampleActions.getByIdRequest, getByIdModuleExample);
  yield takeLatest(moduleExampleActions.createRequest, createModuleExample);
  yield takeLatest(moduleExampleActions.updateRequest, updateModuleExample);
  yield takeLatest(moduleExampleActions.deleteRequest, deleteModuleExample);
}
