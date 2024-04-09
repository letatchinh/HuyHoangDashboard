import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../notification.api'; 
import { notificationActions } from './reducer';

function* getListNotification({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(notificationActions.getListSuccess(data));
  } catch (error:any) {
    yield put(notificationActions.getListFailed(error));
  }
}

function* getByIdNotification({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(notificationActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(notificationActions.getByIdFailed(error));
  }
}

function* createNotification({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(notificationActions.createSuccess(data));
  } catch (error:any) {
    yield put(notificationActions.createFailed(error));
  }
}

function* updateNotification({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(notificationActions.updateSuccess(data));
  } catch (error:any) {
    yield put(notificationActions.updateFailed(error));
  }
}
function* deleteNotification({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(notificationActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(notificationActions.deleteFailed(error));
  }
}


export default function* notificationSaga() {
  yield takeLatest(notificationActions.getListRequest, getListNotification);
  yield takeLatest(notificationActions.getByIdRequest, getByIdNotification);
  yield takeLatest(notificationActions.createRequest, createNotification);
  yield takeLatest(notificationActions.updateRequest, updateNotification);
  yield takeLatest(notificationActions.deleteRequest, deleteNotification);
}
