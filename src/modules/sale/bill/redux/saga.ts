import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../bill.api'; 
import { billSliceAction } from './reducer';
import BillItemModule from '~/modules/sale/billItem';
function* getListBill({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(billSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(billSliceAction.getListFailed(error));
  }
}

function* getListDebt() : any {
  try {
    const data = yield call(api.getDebtRule);
    yield put(billSliceAction.getDebtSuccess(data));
  } catch (error:any) {
    yield put(billSliceAction.getDebtFailed(error));
  }
}

function* getByIdBill({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(billSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(billSliceAction.getByIdFailed(error));
  }
}

function* createBill({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(billSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(billSliceAction.createFailed(error));
  }
}

function* updateBill({payload} : any) : any {
  try {
    const {callbackSubmit,...params} = payload;
    const data = yield call(api.update,params);
    if(callbackSubmit && typeof callbackSubmit === 'function'){
      callbackSubmit();
    }
    yield put(billSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(billSliceAction.updateFailed(error));
  }
}
function* deleteBill({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(billSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(billSliceAction.deleteFailed(error));
  }
}

function* updateBillItem({payload} : any) : any {
  try {
    const {callbackSubmit,...params} = payload;
    const data = yield call(BillItemModule.api.update,params);
    yield put(billSliceAction.updateBillItemSuccess(params));
    if(callbackSubmit && typeof callbackSubmit === 'function'){
      callbackSubmit();
    }
  } catch (error:any) {
    yield put(billSliceAction.updateBillItemFailed(error));
  }
}

export default function* billSaga() {
  yield takeLatest(billSliceAction.getListRequest, getListBill);
  yield takeLatest(billSliceAction.getDebtRequest, getListDebt);
  yield takeLatest(billSliceAction.getByIdRequest, getByIdBill);
  yield takeLatest(billSliceAction.createRequest, createBill);
  yield takeLatest(billSliceAction.updateRequest, updateBill);
  yield takeLatest(billSliceAction.deleteRequest, deleteBill);
  yield takeLatest(billSliceAction.updateBillItemRequest, updateBillItem);
}
