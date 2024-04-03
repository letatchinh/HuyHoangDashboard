import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../receiptVoucher.api'; 
import { receiptVoucherSliceAction } from './reducer';

function* getListReceiptVoucher({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(receiptVoucherSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(receiptVoucherSliceAction.getListFailed(error));
  }
};

function* getListReceiptVoucherByBillId({payload:query} : any) : any {
  try {
    const data = yield call(api.getAllByBillId,query);
    yield put(receiptVoucherSliceAction.getListByBillIdSuccess(data));
  } catch (error:any) {
    yield put(receiptVoucherSliceAction.getListByBillIdFailed(error));
  }
};

function* getByIdReceiptVoucher({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(receiptVoucherSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(receiptVoucherSliceAction.getByIdFailed(error));
  }
}

function* createReceiptVoucher({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(receiptVoucherSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(receiptVoucherSliceAction.createFailed(error));
  }
}

function* updateReceiptVoucher({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(receiptVoucherSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(receiptVoucherSliceAction.updateFailed(error));
  }
}
function* deleteReceiptVoucher({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(receiptVoucherSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(receiptVoucherSliceAction.deleteFailed(error));
  }
};

function* confirmReceiptVoucher({payload} : any) : any {
  try {
    const data = yield call(api.confirm,payload);
    yield put(receiptVoucherSliceAction.confirmReceiptVoucherSuccess(data));
  } catch (error:any) {
    yield put(receiptVoucherSliceAction.confirmReceiptVoucherFailed(error));
  }
};


export default function* receiptVoucherSaga() {
  yield takeLatest(receiptVoucherSliceAction.getListRequest, getListReceiptVoucher);
  yield takeLatest(receiptVoucherSliceAction.getListByBillIdRequest, getListReceiptVoucherByBillId);
  yield takeLatest(receiptVoucherSliceAction.getByIdRequest, getByIdReceiptVoucher);
  yield takeLatest(receiptVoucherSliceAction.createRequest, createReceiptVoucher);
  yield takeLatest(receiptVoucherSliceAction.updateRequest, updateReceiptVoucher);
  yield takeLatest(receiptVoucherSliceAction.deleteRequest, deleteReceiptVoucher);
  yield takeLatest(receiptVoucherSliceAction.confirmReceiptVoucherRequest, confirmReceiptVoucher);
}
