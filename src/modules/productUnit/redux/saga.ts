import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../productUnit.api'; 
import { productUnitActions } from './reducer';

function* getListProductUnit({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(productUnitActions.getListSuccess(data));
  } catch (error:any) {
    yield put(productUnitActions.getListFailed(error));
  }
}

function* getByIdProductUnit({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(productUnitActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(productUnitActions.getByIdFailed(error));
  }
}

function* createProductUnit({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(productUnitActions.createSuccess(data));
  } catch (error:any) {
    yield put(productUnitActions.createFailed(error));
  }
}

function* updateProductUnit({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(productUnitActions.updateSuccess(data));
  } catch (error:any) {
    yield put(productUnitActions.updateFailed(error));
  }
}
function* deleteProductUnit({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(productUnitActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(productUnitActions.deleteFailed(error));
  }
}


export default function* productUnitSaga() {
  yield takeLatest(productUnitActions.getListRequest, getListProductUnit);
  yield takeLatest(productUnitActions.getByIdRequest, getByIdProductUnit);
  yield takeLatest(productUnitActions.createRequest, createProductUnit);
  yield takeLatest(productUnitActions.updateRequest, updateProductUnit);
  yield takeLatest(productUnitActions.deleteRequest, deleteProductUnit);
}
