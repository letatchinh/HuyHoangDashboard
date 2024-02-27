import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../supplier.api'; 
import { supplierSliceAction } from './reducer';

function* getListModuleExample({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(supplierSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.getListFailed(error));
  }
};

function* getListProductSupplier({payload:query} : any) : any {
  try {
    const data = yield call(api.getDebt,query);
    yield put(supplierSliceAction.getProductSupplierSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.getProductSupplierFailed(error));
  }
};

function* getListVoucherSupplier({ payload: query }: any): any {
  try {
    const data = yield call(api.getVouchers,query);
    yield put(supplierSliceAction.getVoucherSupplierSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.getVoucherSupplierFailed(error));
  }
};
function* getSuppliersProductAuthor({payload:query} : any) : any {
  try {
    const data = yield call(api.getAllAuthorProduct,query);
    yield put(supplierSliceAction.getSuppliersProductAuthorSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.getSuppliersProductAuthorFailed(error));
  }
}


function* getByIdModuleExample({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(supplierSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.getByIdFailed(error));
  }
};

function* createModuleExample({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(supplierSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.createFailed(error));
  }
};

function* updateModuleExample({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(supplierSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.updateFailed(error));
  }
};

function* deleteModuleExample({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(supplierSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.deleteFailed(error));
  }
};

// Revenue Supplier

function* getRevenueSupplierById({payload:query} : any) : any {
  try {
    const data = yield call(api.getAllRevenueByIdSupplier,query);
    yield put(supplierSliceAction.getRevenueSupplierSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.getRevenueSupplierFailed(error));
  }
};

function* getTotalRevenueSupplierById({payload:query} : any) : any {
  try {
    const data = yield call(api.getTotalRevenue, query);
    yield put(supplierSliceAction.getTotalRevenueSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.getTotalRevenueFailed(error));
  }
};

function* updateRevenueSupplier({payload} : any) : any {
  try {
    const data = yield call(api.updateRevenue,payload);
    yield put(supplierSliceAction.updateRevenueSupplierSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.updateRevenueSupplierFailed(error));
  }
};

function* updateTotalRevenueSupplier({payload} : any) : any {
  try {
    const data = yield call(api.updateTotalRevenue,payload);
    yield put(supplierSliceAction.updateTotalRevenueSupplierSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.updateTotalRevenueSupplierFailed(error));
  }
};

function* createTotalRevenue({payload} : any) : any {
  try {
    const data = yield call(api.createTotalRevenue,payload);
    yield put(supplierSliceAction.createTotalRevenueSuccess(data));
  } catch (error:any) {
    yield put(supplierSliceAction.createTotalRevenueFailed(error));
  }
};

export default function* supplierSaga() {
  yield takeLatest(supplierSliceAction.getListRequest, getListModuleExample);
  yield takeLatest(supplierSliceAction.getProductSupplierRequest, getListProductSupplier);
  yield takeLatest(supplierSliceAction.getVoucherSupplierRequest, getListVoucherSupplier);
  yield takeLatest(supplierSliceAction.getListRequest, getListModuleExample);
  yield takeLatest(supplierSliceAction.getByIdRequest, getByIdModuleExample);
  yield takeLatest(supplierSliceAction.createRequest, createModuleExample);
  yield takeLatest(supplierSliceAction.updateRequest, updateModuleExample);
  yield takeLatest(supplierSliceAction.deleteRequest, deleteModuleExample);
  yield takeLatest(supplierSliceAction.getSuppliersProductAuthorRequest, getSuppliersProductAuthor);
  yield takeLatest(supplierSliceAction.getRevenueSupplierRequest, getRevenueSupplierById);
  yield takeLatest(supplierSliceAction.updateRevenueSupplierRequest, updateRevenueSupplier);
  yield takeLatest(supplierSliceAction.updateTotalRevenueSupplierRequest, updateTotalRevenueSupplier);
  yield takeLatest(supplierSliceAction.createTotalRevenueRequest, createTotalRevenue);
  yield takeLatest(supplierSliceAction.getTotalRevenueRequest, getTotalRevenueSupplierById);
}
