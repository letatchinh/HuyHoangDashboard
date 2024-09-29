import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../staff.api'; 
import { staffActions } from './reducer';

function* getListStaff({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(staffActions.getListSuccess(data));
  } catch (error:any) {
    yield put(staffActions.getListFailed(error));
  }
}

function* getByIdStaff({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(staffActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(staffActions.getByIdFailed(error));
  }
}

function* createStaff({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(staffActions.createSuccess(data));
  } catch (error:any) {
    yield put(staffActions.createFailed(error));
  }
}

function* updateStaff({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(staffActions.updateSuccess(data));
  } catch (error:any) {
    yield put(staffActions.updateFailed(error));
  }
}
function* deleteStaff({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(staffActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(staffActions.deleteFailed(error));
  }
}


export default function* staffSaga() {
  yield takeLatest(staffActions.getListRequest, getListStaff);
  yield takeLatest(staffActions.getByIdRequest, getByIdStaff);
  yield takeLatest(staffActions.createRequest, createStaff);
  yield takeLatest(staffActions.updateRequest, updateStaff);
  yield takeLatest(staffActions.deleteRequest, deleteStaff);
}
