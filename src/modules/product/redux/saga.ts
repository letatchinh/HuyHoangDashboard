import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../product.api'; 
import { productActions } from './reducer';

function* getListProduct({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(productActions.getListSuccess(data));
  } catch (error:any) {
    yield put(productActions.getListFailed(error));
  }
}

function* getByIdProduct({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(productActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(productActions.getByIdFailed(error));
  }
}

function* createProduct({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(productActions.createSuccess(data));
  } catch (error:any) {
    yield put(productActions.createFailed(error));
  }
}

function* updateProduct({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(productActions.updateSuccess(data));
  } catch (error:any) {
    yield put(productActions.updateFailed(error));
  }
}
function* deleteProduct({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(productActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(productActions.deleteFailed(error));
  }
}


export default function* productSaga() {
  yield takeLatest(productActions.getListRequest, getListProduct);
  yield takeLatest(productActions.getByIdRequest, getByIdProduct);
  yield takeLatest(productActions.createRequest, createProduct);
  yield takeLatest(productActions.updateRequest, updateProduct);
  yield takeLatest(productActions.deleteRequest, deleteProduct);
}
