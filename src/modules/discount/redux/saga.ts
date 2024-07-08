import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../discount.api'; 
import { discountActions } from './reducer';

function* getListDiscount({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(discountActions.getListSuccess(data));
    yield put(discountActions.clearAction());
  } catch (error:any) {
    yield put(discountActions.getListFailed(error));
  }
}

function* getByIdDiscount({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(discountActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(discountActions.getByIdFailed(error));
  }
}

function* createDiscount({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(discountActions.createSuccess(data));
  } catch (error:any) {
    yield put(discountActions.createFailed(error));
  }
}

function* updateDiscount({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(discountActions.updateSuccess(data));
  } catch (error:any) {
    yield put(discountActions.updateFailed(error));
  }
}
function* deleteDiscount({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(discountActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(discountActions.deleteFailed(error));
  }
}


export default function* discountSaga() {
  yield takeLatest(discountActions.getListRequest, getListDiscount);
  yield takeLatest(discountActions.getByIdRequest, getByIdDiscount);
  yield takeLatest(discountActions.createRequest, createDiscount);
  yield takeLatest(discountActions.updateRequest, updateDiscount);
  yield takeLatest(discountActions.deleteRequest, deleteDiscount);
}
