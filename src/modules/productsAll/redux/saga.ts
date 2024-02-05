import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../productsAll.api'; 
import { productsAllSliceAction } from './reducer';

function* getListProductsAll({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(productsAllSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(productsAllSliceAction.getListFailed(error));
  }
}

function* getByIdProductsAll({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(productsAllSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(productsAllSliceAction.getByIdFailed(error));
  }
}

function* createProductsAll({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(productsAllSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(productsAllSliceAction.createFailed(error));
  }
}

function* updateProductsAll({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(productsAllSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(productsAllSliceAction.updateFailed(error));
  }
}
function* deleteProductsAll({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(productsAllSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(productsAllSliceAction.deleteFailed(error));
  }
}


export default function* productsAllSaga() {
  yield takeLatest(productsAllSliceAction.getListRequest, getListProductsAll);
  yield takeLatest(productsAllSliceAction.getByIdRequest, getByIdProductsAll);
  yield takeLatest(productsAllSliceAction.createRequest, createProductsAll);
  yield takeLatest(productsAllSliceAction.updateRequest, updateProductsAll);
  yield takeLatest(productsAllSliceAction.deleteRequest, deleteProductsAll);
}
