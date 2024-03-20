import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../configDiscount.api'; 
import { configDiscountSliceAction } from './reducer';

function* getListConfigDiscount({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll, query);
    yield put(configDiscountSliceAction.getListSuccess(data));
  } catch (error: any) {
    yield put(configDiscountSliceAction.getListFailed(error));
  }
};

function* getByIdConfigDiscount({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(configDiscountSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(configDiscountSliceAction.getByIdFailed(error));
  }
}

function* createConfigDiscount({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(configDiscountSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(configDiscountSliceAction.createFailed(error));
  }
}

function* updateConfigDiscount({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(configDiscountSliceAction.updateListSuccess(data));
  } catch (error:any) {
    yield put(configDiscountSliceAction.updateListFailed(error));
  }
}
function* deleteConfigDiscount({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(configDiscountSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(configDiscountSliceAction.deleteFailed(error));
  }
}


export default function* configDiscountSaga() {
  yield takeLatest(configDiscountSliceAction.getListRequest, getListConfigDiscount);
  yield takeLatest(configDiscountSliceAction.getByIdRequest, getByIdConfigDiscount);
  yield takeLatest(configDiscountSliceAction.createRequest, createConfigDiscount);
  yield takeLatest(configDiscountSliceAction.updateRequest, updateConfigDiscount);
  yield takeLatest(configDiscountSliceAction.deleteRequest, deleteConfigDiscount);
}
