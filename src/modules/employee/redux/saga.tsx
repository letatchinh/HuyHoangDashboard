import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../employee.api'; 
import { employeeSliceAction } from './reducer';

function* getListEmployee({ payload: query }: any): any {
  try {
    const data = yield call(api.getAll,query);
    yield put(employeeSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(employeeSliceAction.getListFailed(error));
  }
}

function* getByIdEmployee({ payload: id }: any): any {
  try {
    const data = yield call(api.getById, id);
    yield put(employeeSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(employeeSliceAction.getByIdFailed(error));
  }
}

function* createEmployee({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(employeeSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(employeeSliceAction.createFailed(error));
  }
}

function* updateEmployee({ payload }: any): any {
  try {
    const data = yield call(api.update,payload);
    yield put(employeeSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(employeeSliceAction.updateFailed(error));
  }
}
function* deleteEmployee({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(employeeSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(employeeSliceAction.deleteFailed(error));
  }
}

function* convertEmployee({ payload }: any): any {
  try {
    const data = yield call(api.convert,payload);
    yield put(employeeSliceAction.convertSuccess(data));
  } catch (error:any) {
    yield put(employeeSliceAction.convertFailed(error));
  }
}

export default function* employeeSaga() {
  yield takeLatest(employeeSliceAction.getListRequest, getListEmployee);
  yield takeLatest(employeeSliceAction.getByIdRequest, getByIdEmployee);
  yield takeLatest(employeeSliceAction.createRequest, createEmployee);
  yield takeLatest(employeeSliceAction.updateRequest, updateEmployee);
  yield takeLatest(employeeSliceAction.deleteRequest, deleteEmployee);
  yield takeLatest(employeeSliceAction.convertRequest, convertEmployee);
}
