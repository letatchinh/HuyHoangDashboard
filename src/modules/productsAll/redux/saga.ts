import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../productsAll.api'; 
import { productsAllActions } from './reducer';

function* getListProductsAll({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(productsAllActions.getListSuccess(data));
  } catch (error:any) {
    yield put(productsAllActions.getListFailed(error));
  }
}

function* getByIdProductsAll({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(productsAllActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(productsAllActions.getByIdFailed(error));
  }
}

function* createProductsAll({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(productsAllActions.createSuccess(data));
  } catch (error:any) {
    yield put(productsAllActions.createFailed(error));
  }
}

function* updateProductsAll({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(productsAllActions.updateSuccess(data));
  } catch (error:any) {
    yield put(productsAllActions.updateFailed(error));
  }
}
function* deleteProductsAll({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(productsAllActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(productsAllActions.deleteFailed(error));
  }
}


export default function* productsAllSaga() {
  yield takeLatest(productsAllActions.getListRequest, getListProductsAll);
  yield takeLatest(productsAllActions.getByIdRequest, getByIdProductsAll);
  yield takeLatest(productsAllActions.createRequest, createProductsAll);
  yield takeLatest(productsAllActions.updateRequest, updateProductsAll);
  yield takeLatest(productsAllActions.deleteRequest, deleteProductsAll);
}
