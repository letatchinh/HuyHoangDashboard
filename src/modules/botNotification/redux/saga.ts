import { put, call, takeLatest } from "redux-saga/effects";
import api from "../botNotification.api";
import { botNotificationActions } from "./reducer";

function* getListBotNotification({ payload: query }: any): any {
  try {
    const data = yield call(api.getAll, query);
    yield put(botNotificationActions.getListSuccess(data));
  } catch (error: any) {
    yield put(botNotificationActions.getListFailed(error));
  }
}

function* createBotNotification({ payload }: any): any {
  try {
    const data = yield call(api.create, payload);
    yield put(botNotificationActions.createSuccess(data));
  } catch (error: any) {
    yield put(botNotificationActions.createFailed(error));
  }
}

function* updateBotNotification({ payload }: any): any {
  try {
    const data = yield call(api.create, payload);
    yield put(botNotificationActions.updateSuccess(data));
  } catch (error: any) {
    yield put(botNotificationActions.updateFailed(error));
  }
}

export default function* botNotificationSaga() {
  yield takeLatest(botNotificationActions.getListRequest, getListBotNotification);
  yield takeLatest(botNotificationActions.createRequest, createBotNotification);
  yield takeLatest(botNotificationActions.updateRequest, updateBotNotification);
}
