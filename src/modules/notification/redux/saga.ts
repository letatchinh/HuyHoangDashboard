import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../notification.api'; 
import { notificationSliceActions } from './reducer';

function* getListNotification({payload:query} : any) : any {
  try {
    const data = yield call(api.getMyNotification,query);
    yield put(notificationSliceActions.getNotificationSuccess(data));
  } catch (error:any) {
    yield put(notificationSliceActions.getNotificationFailed(error));
  }
};

// function* getByIdNotification({payload:id} : any) : any {
//   try {
//     const data = yield call(api.getById,id);
//     yield put(notificationSliceActions.getByIdSuccess(data));
//   } catch (error:any) {
//     yield put(notificationSliceActions.getByIdFailed(error));
//   }
// }

// function* createNotification({payload} : any) : any {
//   try {
//     const data = yield call(api.create,payload);
//     yield put(notificationSliceActions.createSuccess(data));
//   } catch (error:any) {
//     yield put(notificationSliceActions.createFailed(error));
//   }
// }

function* updateStatusNotification({ payload }: any): any {
  console.log('saga')
  try {
    const data = yield call(api.updateStatus,payload);
    yield put(notificationSliceActions.updateSuccess(data));
  } catch (error:any) {
    yield put(notificationSliceActions.updateFailed(error));
  }
}
// function* deleteNotification({payload : id} : any) : any {
//   try {
//     const data = yield call(api.delete,id);
//     yield put(notificationSliceActions.deleteSuccess(data));
//   } catch (error:any) {
//     yield put(notificationSliceActions.deleteFailed(error));
//   }
// }


export default function* notificationSaga() {
  yield takeLatest(notificationSliceActions.getNotificationRequest, getListNotification);
  yield takeLatest(notificationSliceActions.updateRequest, updateStatusNotification);
  // yield takeLatest(notificationSliceActions.getByIdRequest, getByIdNotification);
  // yield takeLatest(notificationSliceActions.createRequest, createNotification);
  // yield takeLatest(notificationSliceActions.deleteRequest, deleteNotification);
}
