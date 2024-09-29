import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../courseGroup.api'; 
import { courseGroupActions } from './reducer';

function* getListCourseGroup({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(courseGroupActions.getListSuccess(data));
  } catch (error:any) {
    yield put(courseGroupActions.getListFailed(error));
  }
}

function* getByIdCourseGroup({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(courseGroupActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(courseGroupActions.getByIdFailed(error));
  }
}

function* createCourseGroup({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(courseGroupActions.createSuccess(data));
  } catch (error:any) {
    yield put(courseGroupActions.createFailed(error));
  }
}

function* updateCourseGroup({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(courseGroupActions.updateSuccess(data));
  } catch (error:any) {
    yield put(courseGroupActions.updateFailed(error));
  }
}
function* deleteCourseGroup({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(courseGroupActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(courseGroupActions.deleteFailed(error));
  }
}


export default function* courseGroupSaga() {
  yield takeLatest(courseGroupActions.getListRequest, getListCourseGroup);
  yield takeLatest(courseGroupActions.getByIdRequest, getByIdCourseGroup);
  yield takeLatest(courseGroupActions.createRequest, createCourseGroup);
  yield takeLatest(courseGroupActions.updateRequest, updateCourseGroup);
  yield takeLatest(courseGroupActions.deleteRequest, deleteCourseGroup);
}
