import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../employeeGroup.api'; 
import { employeeGroupActions } from './reducer';

function* getListEmployeeGroup({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(employeeGroupActions.getListSuccess(data));
  } catch (error:any) {
    yield put(employeeGroupActions.getListFailed(error));
  }
}

function* getByIdEmployeeGroup({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(employeeGroupActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(employeeGroupActions.getByIdFailed(error));
  }
}

function* createEmployeeGroup({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(employeeGroupActions.createSuccess(data));
  } catch (error:any) {
    yield put(employeeGroupActions.createFailed(error));
  }
}

function* updateEmployeeGroup({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(employeeGroupActions.updateSuccess(data));
  } catch (error:any) {
    yield put(employeeGroupActions.updateFailed(error));
  }
}
function* deleteEmployeeGroup({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(employeeGroupActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(employeeGroupActions.deleteFailed(error));
  }
}


export default function* employeeGroupSaga() {
  yield takeLatest(employeeGroupActions.getListRequest, getListEmployeeGroup);
  yield takeLatest(employeeGroupActions.getByIdRequest, getByIdEmployeeGroup);
  yield takeLatest(employeeGroupActions.createRequest, createEmployeeGroup);
  yield takeLatest(employeeGroupActions.updateRequest, updateEmployeeGroup);
  yield takeLatest(employeeGroupActions.deleteRequest, deleteEmployeeGroup);
}
