import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../moduleExample.api'; 
import { moduleExampleSliceAction } from './reducer';

function* getListModuleExample({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(moduleExampleSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(moduleExampleSliceAction.getListFailed(error));
  }
}

function* getByIdModuleExample({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(moduleExampleSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(moduleExampleSliceAction.getByIdFailed(error));
  }
}

function* createModuleExample({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(moduleExampleSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(moduleExampleSliceAction.createFailed(error));
  }
}

function* updateModuleExample({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(moduleExampleSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(moduleExampleSliceAction.updateFailed(error));
  }
}
function* deleteModuleExample({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(moduleExampleSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(moduleExampleSliceAction.deleteFailed(error));
  }
}


export default function* moduleExampleSaga() {
  yield takeLatest(moduleExampleSliceAction.getListRequest, getListModuleExample);
  yield takeLatest(moduleExampleSliceAction.getByIdRequest, getByIdModuleExample);
  yield takeLatest(moduleExampleSliceAction.createRequest, createModuleExample);
  yield takeLatest(moduleExampleSliceAction.updateRequest, updateModuleExample);
  yield takeLatest(moduleExampleSliceAction.deleteRequest, deleteModuleExample);
}
