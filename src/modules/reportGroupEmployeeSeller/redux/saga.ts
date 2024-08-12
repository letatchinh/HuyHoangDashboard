import { put, call, takeLatest } from "redux-saga/effects";
import api from "../reportGroupEmployeeSeller.api";
import { reportGroupEmployeeSellerActions } from "./reducer";

function* getListReportGroupEmployeeSeller({ payload: query }: any): any {
  try {
    const data = yield call(api.getAll, query);
    yield put(reportGroupEmployeeSellerActions.getListSuccess(data));
    yield put(reportGroupEmployeeSellerActions.clearAction());
  } catch (error: any) {
    yield put(reportGroupEmployeeSellerActions.getListFailed(error));
  }
}

function* getListProductReportGroupEmployeeSeller({payload: query}: any): any {
  try {
    const data = yield call(api.getProducts, query);
    yield put(reportGroupEmployeeSellerActions.getListProductSuccess(data));
    yield put(reportGroupEmployeeSellerActions.clearAction());
  } catch (error: any) {
    yield put(reportGroupEmployeeSellerActions.getListProductFailed(error));
  }
}

function* getGroupSeller({payload: query}: any): any {
  try {
    const data = yield call(api.getGroupSeller, query);
    yield put(reportGroupEmployeeSellerActions.getGroupSellerSuccess(data));
    yield put(reportGroupEmployeeSellerActions.clearAction());
  } catch (error: any) {
    yield put(reportGroupEmployeeSellerActions.getGroupSellerFailed(error));
  }
}

function* createReportGroupEmployeeSeller({ payload }: any): any {
  try {
    const data = yield call(api.create, payload);
    yield put(reportGroupEmployeeSellerActions.createSuccess(data));
  } catch (error: any) {
    yield put(reportGroupEmployeeSellerActions.createFailed(error));
  }
}

function* updateReportGroupEmployeeSeller({ payload }: any): any {
  try {
    const data = yield call(api.update, payload);
    yield put(reportGroupEmployeeSellerActions.updateSuccess(data));
  } catch (error: any) {
    yield put(reportGroupEmployeeSellerActions.updateFailed(error));
  }
}
function* deleteReportGroupEmployeeSeller({ payload: id }: any): any {
  try {
    const data = yield call(api.delete, id);
    yield put(reportGroupEmployeeSellerActions.deleteSuccess(data));
  } catch (error: any) {
    yield put(reportGroupEmployeeSellerActions.deleteFailed(error));
  }
}

export default function* reportGroupEmployeeSellerSaga() {
  yield takeLatest(
    reportGroupEmployeeSellerActions.getListRequest,
    getListReportGroupEmployeeSeller
  );
  yield takeLatest(
    reportGroupEmployeeSellerActions.getListProductRequest,
    getListProductReportGroupEmployeeSeller
  );
  yield takeLatest(
    reportGroupEmployeeSellerActions.getGroupSellerRequest,
    getGroupSeller
  );
  yield takeLatest(
    reportGroupEmployeeSellerActions.createRequest,
    createReportGroupEmployeeSeller
  );
  yield takeLatest(
    reportGroupEmployeeSellerActions.updateRequest,
    updateReportGroupEmployeeSeller
  );
  yield takeLatest(
    reportGroupEmployeeSellerActions.deleteRequest,
    deleteReportGroupEmployeeSeller
  );
}
