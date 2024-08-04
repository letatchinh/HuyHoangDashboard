import { put, call, takeLatest } from "redux-saga/effects";
import api from "../typePharmacy.api";
import { typePharmacyActions } from "./reducer";

function* getListTypePharmacy({ payload: query }: any): any {
  try {
    const data = yield call(api.getAll, query);
    yield put(typePharmacyActions.getListSuccess(data));
  } catch (error: any) {
    yield put(typePharmacyActions.getListFailed(error));
  }
}

function* getByIdTypePharmacy({ payload: id }: any): any {
  try {
    const data = yield call(api.getById, id);
    yield put(typePharmacyActions.getByIdSuccess(data));
  } catch (error: any) {
    yield put(typePharmacyActions.getByIdFailed(error));
  }
}

function* createTypePharmacy({ payload }: any): any {
  try {
    const data = yield call(api.create, payload);
    yield put(typePharmacyActions.createSuccess(data));
  } catch (error: any) {
    yield put(typePharmacyActions.createFailed(error));
  }
}

function* updateTypePharmacy({ payload }: any): any {
  try {
    const data = yield call(api.update, payload);
    yield put(typePharmacyActions.updateSuccess(data));
  } catch (error: any) {
    yield put(typePharmacyActions.updateFailed(error));
  }
}
function* deleteTypePharmacy({ payload: id }: any): any {
  try {
    const data = yield call(api.delete, id);
    yield put(typePharmacyActions.deleteSuccess(data));
  } catch (error: any) {
    yield put(typePharmacyActions.deleteFailed(error));
  }
}

function* getSearchListType({ payload: query }: any): any {
  try {
    const data = yield call(api.searchList, query);
    yield put(typePharmacyActions.getListSearchSuccess(data));
  } catch (error: any) {
    yield put(typePharmacyActions.getListSearchFailed(error));
  }
}

export default function* typePharmacySaga() {
  yield takeLatest(typePharmacyActions.getListRequest, getListTypePharmacy);
  yield takeLatest(typePharmacyActions.getByIdRequest, getByIdTypePharmacy);
  yield takeLatest(typePharmacyActions.createRequest, createTypePharmacy);
  yield takeLatest(typePharmacyActions.updateRequest, updateTypePharmacy);
  yield takeLatest(typePharmacyActions.deleteRequest, deleteTypePharmacy);
  yield takeLatest(typePharmacyActions.getListSearchRequest, getSearchListType)
}
