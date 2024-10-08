import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../teacher.api'; 
import { teacherActions } from './reducer';

function* getListTeacher({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(teacherActions.getListSuccess(data));
  } catch (error:any) {
    yield put(teacherActions.getListFailed(error));
  }
}

function* getByIdTeacher({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(teacherActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(teacherActions.getByIdFailed(error));
  }
}

function* createTeacher({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(teacherActions.createSuccess(data));
  } catch (error:any) {
    yield put(teacherActions.createFailed(error));
  }
}

function* updateTeacher({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(teacherActions.updateSuccess(data));
  } catch (error:any) {
    yield put(teacherActions.updateFailed(error));
  }
}
function* deleteTeacher({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(teacherActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(teacherActions.deleteFailed(error));
  }
}


export default function* teacherSaga() {
  yield takeLatest(teacherActions.getListRequest, getListTeacher);
  yield takeLatest(teacherActions.getByIdRequest, getByIdTeacher);
  yield takeLatest(teacherActions.createRequest, createTeacher);
  yield takeLatest(teacherActions.updateRequest, updateTeacher);
  yield takeLatest(teacherActions.deleteRequest, deleteTeacher);
}
