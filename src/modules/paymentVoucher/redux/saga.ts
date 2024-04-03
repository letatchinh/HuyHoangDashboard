import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../paymentVoucher.api'; 
import { paymentVoucherSliceAction } from './reducer';

function* getListPaymentVoucher({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(paymentVoucherSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(paymentVoucherSliceAction.getListFailed(error));
  }
};

function* getListPaymentVoucherByBillId({payload:query} : any) : any {
  try {
    const data = yield call(api.getAllByBillId,query);
    yield put(paymentVoucherSliceAction.getListByBillIdSuccess(data));
  } catch (error:any) {
    yield put(paymentVoucherSliceAction.getListByBillIdFailed(error));
  }
};

function* getByIdPaymentVoucher({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(paymentVoucherSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(paymentVoucherSliceAction.getByIdFailed(error));
  }
};

function* createPaymentVoucher({ payload }: any): any {
  try {
    const data = yield call(api.create, payload);
    yield put(paymentVoucherSliceAction.createSuccess(data));
  } catch (error: any) {
    console.log(error)
    yield put(paymentVoucherSliceAction.createFailed(error));
  }
};

function* updatePaymentVoucher({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(paymentVoucherSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(paymentVoucherSliceAction.updateFailed(error));
  }
};
function* confirmPaymentVoucher({payload} : any) : any {
  try {
    const data = yield call(api.confirm,payload);
    yield put(paymentVoucherSliceAction.confirmPaymentVoucherSuccess(data));
  } catch (error:any) {
    yield put(paymentVoucherSliceAction.confirmPaymentVoucherFailed(error));
  }
};

function* deletePaymentVoucher({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(paymentVoucherSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(paymentVoucherSliceAction.deleteFailed(error));
  }
};


export default function* paymentVoucherSaga() {
  yield takeLatest(paymentVoucherSliceAction.getListRequest, getListPaymentVoucher);
  yield takeLatest(paymentVoucherSliceAction.getListByBillIdRequest, getListPaymentVoucherByBillId);
  yield takeLatest(paymentVoucherSliceAction.getByIdRequest, getByIdPaymentVoucher);
  yield takeLatest(paymentVoucherSliceAction.createRequest, createPaymentVoucher);
  yield takeLatest(paymentVoucherSliceAction.updateRequest, updatePaymentVoucher);
  yield takeLatest(paymentVoucherSliceAction.deleteRequest, deletePaymentVoucher);
  yield takeLatest(paymentVoucherSliceAction.confirmPaymentVoucherRequest, confirmPaymentVoucher);
};
