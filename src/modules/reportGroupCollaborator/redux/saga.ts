import { put, call, takeLatest } from "redux-saga/effects";
import api from "../reportGroupCollaborator.api";
import { reportGroupCollaboratorActions } from "./reducer";

function* getListReportGroupCollaborator({ payload: query }: any): any {
  try {
    const data = yield call(api.getAll, query);
    yield put(reportGroupCollaboratorActions.getListSuccess(data));
    yield put(reportGroupCollaboratorActions.clearAction());
  } catch (error: any) {
    yield put(reportGroupCollaboratorActions.getListFailed(error));
  }
}

function* getListReportGroupCollaboratorBill({ payload: query }: any): any {
  try {
    const data = yield call(api.getAllBill, query);
    yield put(reportGroupCollaboratorActions.getListBillSuccess(data));
    yield put(reportGroupCollaboratorActions.clearAction());
  } catch (error: any) {
    yield put(reportGroupCollaboratorActions.getListBillFailed(error));
  }
}

function* getByIdReportGroupCollaborator({ payload: id }: any): any {
  try {
    const data = yield call(api.getById, id);
    yield put(reportGroupCollaboratorActions.getByIdSuccess(data));
  } catch (error: any) {
    yield put(reportGroupCollaboratorActions.getByIdFailed(error));
  }
}

function* createReportGroupCollaborator({ payload }: any): any {
  try {
    const data = yield call(api.create, payload);
    yield put(reportGroupCollaboratorActions.createSuccess(data));
  } catch (error: any) {
    yield put(reportGroupCollaboratorActions.createFailed(error));
  }
}

function* updateReportGroupCollaborator({ payload }: any): any {
  try {
    const data = yield call(api.update, payload);
    yield put(reportGroupCollaboratorActions.updateSuccess(data));
  } catch (error: any) {
    yield put(reportGroupCollaboratorActions.updateFailed(error));
  }
}
function* deleteReportGroupCollaborator({ payload: id }: any): any {
  try {
    const data = yield call(api.delete, id);
    yield put(reportGroupCollaboratorActions.deleteSuccess(data));
  } catch (error: any) {
    yield put(reportGroupCollaboratorActions.deleteFailed(error));
  }
}

export default function* reportGroupCollaboratorSaga() {
  yield takeLatest(reportGroupCollaboratorActions.getListRequest, getListReportGroupCollaborator);
  yield takeLatest(reportGroupCollaboratorActions.getListBillRequest, getListReportGroupCollaboratorBill);
  yield takeLatest(reportGroupCollaboratorActions.getByIdRequest, getByIdReportGroupCollaborator);
  yield takeLatest(reportGroupCollaboratorActions.createRequest, createReportGroupCollaborator);
  yield takeLatest(reportGroupCollaboratorActions.updateRequest, updateReportGroupCollaborator);
  yield takeLatest(reportGroupCollaboratorActions.deleteRequest, deleteReportGroupCollaborator);
}
