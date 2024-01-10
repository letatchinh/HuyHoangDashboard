import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../supplier.api'; 
import { supplierSliceAction } from './reducer';

function* getListModuleExample({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(supplierSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.getListFailed(error));
  }
}

function* getByIdModuleExample({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(supplierSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.getByIdFailed(error));
  }
}

function* createModuleExample({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(supplierSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.createFailed(error));
  }
}

function* updateModuleExample({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(supplierSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.updateFailed(error));
  }
}
function* deleteModuleExample({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(supplierSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.deleteFailed(error));
  }
}


export default function* supplierSaga() {
  yield takeLatest(supplierSliceAction.getListRequest, getListModuleExample);
  yield takeLatest(supplierSliceAction.getByIdRequest, getByIdModuleExample);
  yield takeLatest(supplierSliceAction.createRequest, createModuleExample);
  yield takeLatest(supplierSliceAction.updateRequest, updateModuleExample);
  yield takeLatest(supplierSliceAction.deleteRequest, deleteModuleExample);
}
