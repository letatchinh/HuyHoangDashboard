import { put, call, takeLatest } from "redux-saga/effects";
import api from "../groupPharmacy.api";
import { groupPharmacyActions } from "./reducer";

function* getListGroupPharmacy({ payload: query }: any): any {
  try {
    const data = yield call(api.getAll, query);
    yield put(groupPharmacyActions.getListSuccess(data));
  } catch (error: any) {
    yield put(groupPharmacyActions.getListFailed(error));
  }
}

function* getListSearchGroupPharmacy({ payload: query }: any): any {
  try {
    const data = yield call(api.search, query);
    yield put(groupPharmacyActions.getListSearchSuccess(data));
  } catch (error: any) {
    yield put(groupPharmacyActions.getListSearchFailed(error));
  }
}

function* getByIdGroupPharmacy({ payload: id }: any): any {
  try {
    const data = yield call(api.getById, id);
    yield put(groupPharmacyActions.getByIdSuccess(data));
  } catch (error: any) {
    yield put(groupPharmacyActions.getByIdFailed(error));
  }
}

function* createGroupPharmacy({ payload }: any): any {
  try {
    const data = yield call(api.create, payload);
    yield put(groupPharmacyActions.createSuccess(data));
  } catch (error: any) {
    yield put(groupPharmacyActions.createFailed(error));
  }
}

function* updateGroupPharmacy({ payload }: any): any {
  try {
    const data = yield call(api.update, payload);
    yield put(groupPharmacyActions.updateSuccess(data));
  } catch (error: any) {
    yield put(groupPharmacyActions.updateFailed(error));
  }
}
function* deleteGroupPharmacy({ payload: id }: any): any {
  try {
    const data = yield call(api.delete, id);
    yield put(groupPharmacyActions.deleteSuccess(data));
  } catch (error: any) {
    yield put(groupPharmacyActions.deleteFailed(error));
  }
}

export default function* groupPharmacySaga() {
  yield takeLatest(groupPharmacyActions.getListRequest, getListGroupPharmacy);
  yield takeLatest(groupPharmacyActions.getByIdRequest, getByIdGroupPharmacy);
  yield takeLatest(groupPharmacyActions.createRequest, createGroupPharmacy);
  yield takeLatest(groupPharmacyActions.updateRequest, updateGroupPharmacy);
  yield takeLatest(groupPharmacyActions.deleteRequest, deleteGroupPharmacy);
  yield takeLatest(groupPharmacyActions.getListSearchRequest, getListSearchGroupPharmacy);
}
