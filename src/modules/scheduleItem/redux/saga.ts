import { put, call, takeLatest, select } from 'redux-saga/effects';
import { scheduleActions } from '~/modules/schedule/redux/reducer';
import { ScheduleBase } from '~/modules/schedule/schedule.modal';
import api from '../scheduleItem.api'; 
import { scheduleItemActions } from './reducer';

function* getListScheduleItem({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(scheduleItemActions.getListSuccess(data));
  } catch (error:any) {
    yield put(scheduleItemActions.getListFailed(error));
  }
}

function* getByIdScheduleItem({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(scheduleItemActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(scheduleItemActions.getByIdFailed(error));
  }
}

function* createScheduleItem({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    const schedule = yield select((state) => state.schedule.listByCourseId);
    yield put(scheduleItemActions.createSuccess(data));
    const newSchedule = schedule?.map((item : ScheduleBase) => {
      // Step 1 : Find the schedule Updating
      if(item._id === payload?.scheduleId){
        // Step 2 : Update the scheduleItem With New Data
        const newScheduleItem = [...item?.scheduleItem,data];
        return {
          ...item,
          scheduleItem: newScheduleItem
        };
      }

      return item;
    });
      // Step 3 : Update the newSchedule
    yield put(scheduleActions.getListByCourseIdSuccess(newSchedule));
  } catch (error:any) {
    yield put(scheduleItemActions.createFailed(error));
  }
}

function* updateScheduleItem({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(scheduleItemActions.updateSuccess(data));
  } catch (error:any) {
    yield put(scheduleItemActions.updateFailed(error));
  }
}
function* deleteScheduleItem({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(scheduleItemActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(scheduleItemActions.deleteFailed(error));
  }
}


export default function* scheduleItemSaga() {
  yield takeLatest(scheduleItemActions.getListRequest, getListScheduleItem);
  yield takeLatest(scheduleItemActions.getByIdRequest, getByIdScheduleItem);
  yield takeLatest(scheduleItemActions.createRequest, createScheduleItem);
  yield takeLatest(scheduleItemActions.updateRequest, updateScheduleItem);
  yield takeLatest(scheduleItemActions.deleteRequest, deleteScheduleItem);
}
