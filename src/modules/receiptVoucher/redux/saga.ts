import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../receiptVoucher.api'; 
import apiBill from '~/modules/sale/bill/bill.api'
import { receiptVoucherSliceAction } from './reducer';
import { omit } from 'lodash';
import { billSliceAction } from '~/modules/sale/bill/redux/reducer';

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

function* confirmReceiptVoucher({ payload }: any): any {
  try {
    const data = yield call(api.confirm,omit(payload,['isRefetchBill']));
    yield put(receiptVoucherSliceAction.confirmReceiptVoucherSuccess(data));
    if (payload?.isRefetchBill && data?.data?.status === 'APPROVED') {
      const id = payload?.isRefetchBill?.id
      const res = yield call(apiBill.getById,id);
      yield put(billSliceAction.getByIdSuccess(res));
    };
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
