import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../course.api'; 
import { courseActions } from './reducer';

function* getListCourse({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(courseActions.getListSuccess(data));
    yield put(courseActions.clearAction());
  } catch (error:any) {
    yield put(courseActions.getListFailed(error));
  }
}

function* getByIdCourse({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(courseActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(courseActions.getByIdFailed(error));
  }
}

function* createCourse({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(courseActions.createSuccess(data));
  } catch (error:any) {
    yield put(courseActions.createFailed(error));
  }
}

function* updateCourse({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(courseActions.updateSuccess(data));
  } catch (error:any) {
    yield put(courseActions.updateFailed(error));
  }
}
function* deleteCourse({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(courseActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(courseActions.deleteFailed(error));
  }
}


export default function* courseSaga() {
  yield takeLatest(courseActions.getListRequest, getListCourse);
  yield takeLatest(courseActions.getByIdRequest, getByIdCourse);
  yield takeLatest(courseActions.createRequest, createCourse);
  yield takeLatest(courseActions.updateRequest, updateCourse);
  yield takeLatest(courseActions.deleteRequest, deleteCourse);
}
