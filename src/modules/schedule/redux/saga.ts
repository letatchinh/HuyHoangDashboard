import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../schedule.api'; 
import { scheduleActions } from './reducer';

function* getListSchedule({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(scheduleActions.getListSuccess(data));
    yield put(scheduleActions.clearAction());
  } catch (error:any) {
    yield put(scheduleActions.getListFailed(error));
  }
}

function* getListScheduleByCourseId({payload:courseId} : any) : any {
  try {
    const data = yield call(api.getListByCourseId,courseId);
    yield put(scheduleActions.getListByCourseIdSuccess(data));
  } catch (error:any) {
    yield put(scheduleActions.getListByCourseIdFailed(error));
  }
}

function* getByIdSchedule({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(scheduleActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(scheduleActions.getByIdFailed(error));
  }
}

function* createSchedule({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(scheduleActions.createSuccess(data));
  } catch (error:any) {
    yield put(scheduleActions.createFailed(error));
  }
}

function* updateSchedule({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(scheduleActions.updateSuccess(data));
  } catch (error:any) {
    yield put(scheduleActions.updateFailed(error));
  }
}
function* deleteSchedule({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(scheduleActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(scheduleActions.deleteFailed(error));
  }
}


export default function* scheduleSaga() {
  yield takeLatest(scheduleActions.getListRequest, getListSchedule);
  yield takeLatest(scheduleActions.getListByCourseIdRequest, getListScheduleByCourseId);
  yield takeLatest(scheduleActions.getByIdRequest, getByIdSchedule);
  yield takeLatest(scheduleActions.createRequest, createSchedule);
  yield takeLatest(scheduleActions.updateRequest, updateSchedule);
  yield takeLatest(scheduleActions.deleteRequest, deleteSchedule);
}
