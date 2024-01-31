import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../export.api'; 
import { exportSliceAction } from './reducer';

function* getListExport({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(exportSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(exportSliceAction.getListFailed(error));
  }
}

function* getByIdExport({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(exportSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(exportSliceAction.getByIdFailed(error));
  }
}

function* createExport({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(exportSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(exportSliceAction.createFailed(error));
  }
}

function* updateExport({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(exportSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(exportSliceAction.updateFailed(error));
  }
}
function* deleteExport({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(exportSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(exportSliceAction.deleteFailed(error));
  }
}


export default function* exportSaga() {
  yield takeLatest(exportSliceAction.getListRequest, getListExport);
  yield takeLatest(exportSliceAction.getByIdRequest, getByIdExport);
  yield takeLatest(exportSliceAction.createRequest, createExport);
  yield takeLatest(exportSliceAction.updateRequest, updateExport);
  yield takeLatest(exportSliceAction.deleteRequest, deleteExport);
}
