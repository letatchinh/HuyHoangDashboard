import { put, call, takeLatest, delay } from 'redux-saga/effects';
import api from '../coupon.api'; 
import { couponActions } from './reducer';

function* getListCoupon({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(couponActions.getListSuccess(data));
    yield delay(500);
    yield put(couponActions.clearAction());
  } catch (error:any) {
    yield put(couponActions.getListFailed(error));
  }
}

function* getByIdCoupon({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(couponActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(couponActions.getByIdFailed(error));
  }
}

function* createCoupon({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(couponActions.createSuccess(data));
    yield delay(500);
    yield put(couponActions.clearAction());
  } catch (error:any) {
    yield put(couponActions.createFailed(error));
  }
}

function* updateCoupon({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(couponActions.updateSuccess(data));
    yield delay(500);
    yield put(couponActions.clearAction());
  } catch (error:any) {
    yield put(couponActions.updateFailed(error));
  }
}
function* deleteCoupon({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(couponActions.deleteSuccess(data));
    yield delay(500);
    yield put(couponActions.clearAction());
  } catch (error:any) {
    yield put(couponActions.deleteFailed(error));
  }
}


export default function* couponSaga() {
  yield takeLatest(couponActions.getListRequest, getListCoupon);
  yield takeLatest(couponActions.getByIdRequest, getByIdCoupon);
  yield takeLatest(couponActions.createRequest, createCoupon);
  yield takeLatest(couponActions.updateRequest, updateCoupon);
  yield takeLatest(couponActions.deleteRequest, deleteCoupon);
}
