import { call, put, takeLatest } from "redux-saga/effects";
import api from "../pharmacy.api";
import { pharmacySliceAction } from "./reducer";

function* getListPharmacy({ payload: query }: any): any {
  try {
    const data = yield call(api.getAll, query);
    yield put(pharmacySliceAction.getListSuccess(data));
  } catch (error: any) {
    yield put(pharmacySliceAction.getListFailed(error));
  }
}

function* getByIdPharmacy({ payload: id }: any): any {
  try {
    const data = yield call(api.getById, id);
    yield put(pharmacySliceAction.getByIdSuccess(data));
  } catch (error: any) {
    yield put(pharmacySliceAction.getByIdFailed(error));
  }
}

function* createPharmacy({ payload }: any): any {
  try {
    const data = yield call(api.create, payload);
    yield put(pharmacySliceAction.createSuccess(data));
  } catch (error: any) {
    yield put(pharmacySliceAction.createFailed(error));
  }
}

function* updatePharmacy({ payload }: any): any {
  try {
    const data = yield call(api.update, payload);
    yield put(pharmacySliceAction.updateSuccess(data));
  } catch (error: any) {
    yield put(pharmacySliceAction.updateFailed(error));
  }
}

function* deletePharmacy({ payload: id }: any): any {
  try {
    const data = yield call(api.delete, id);
    yield put(pharmacySliceAction.deleteSuccess(data));
  } catch (error: any) {
    yield put(pharmacySliceAction.deleteFailed(error));
  }
}

function* getPharmacyDebt({ payload: query }: any): any {
  try {
    const data = yield call(api.getDebt, query);
    yield put(pharmacySliceAction.getPharmacyDebtSuccess(data));
  } catch (error: any) {
    yield put(pharmacySliceAction.getPharmacyDebtFailed(error));
  }
}

function* getHistoryPharmacy({ payload: id }: any): any {
  try {
    const data = yield call(api.getHistoryById, id);
    yield put(pharmacySliceAction.getHistoryPharmacySuccess(data));
  } catch (error: any) {
    yield put(pharmacySliceAction.getHistoryPharmacyFailed(error));
  }
}

function* getAccumulation({ payload : query }: any): any {
  try {
    const data = yield call(api.getAccumulation, query);
    yield put(pharmacySliceAction.getAccumulationSuccess(data));
  } catch (error: any) {
    yield put(pharmacySliceAction.getAccumulationFailed(error));
  }
}

function* getAccumulationDetail({ payload : id }: any): any {
  try {
    const data = yield call(api.getAccumulationDetail, id);
    yield put(pharmacySliceAction.getAccumulationDetailSuccess(data));
  } catch (error: any) {
    yield put(pharmacySliceAction.getAccumulationDetailFailed(error));
  }
}

export default function* pharmacySaga(): any {
  yield takeLatest(pharmacySliceAction.getListRequest, getListPharmacy);
  yield takeLatest(pharmacySliceAction.getByIdRequest, getByIdPharmacy);
  yield takeLatest(pharmacySliceAction.createRequest, createPharmacy);
  yield takeLatest(pharmacySliceAction.updateRequest, updatePharmacy);
  yield takeLatest(pharmacySliceAction.deleteRequest, deletePharmacy);
  yield takeLatest(pharmacySliceAction.getPharmacyDebtRequest, getPharmacyDebt);
  yield takeLatest(pharmacySliceAction.getHistoryPharmacyRequest, getHistoryPharmacy);
  yield takeLatest(pharmacySliceAction.getAccumulationRequest, getAccumulation);
  yield takeLatest(pharmacySliceAction.getAccumulationDetailRequest, getAccumulationDetail);
}
