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

function* getMyEmployee({ payload: id }: any): any {
  try {
    const data = yield call(api.getMyEmployee, id);
    yield put(employeeSliceAction.getMyEmployeeSuccess(data));
  } catch (error:any) {
    yield put(employeeSliceAction.getMyEmployeeFailed(error));

  }
}

function* addProductEmployee({payload} : any) : any {
  try {
    const data = yield call(api.addProduct, payload);
    yield put(employeeSliceAction.addProductSuccess(data));
  } catch (error: any) {
    yield put(employeeSliceAction.addProductFailed(error));
  }
}

function* removeProductEmployee({payload} : any) : any {
  try {
    const data = yield call(api.removeProduct, payload);
    yield put(employeeSliceAction.removeProductSuccess(data));
  } catch (error: any) {
    yield put(employeeSliceAction.removeProductFailed(error));
  }
}

function* updateProductEmployee({payload} : any) : any {
  try {
    const data = yield call(api.updateProduct, payload);
    yield put(employeeSliceAction.updateProductSuccess(data));
  } catch (error: any) {
    yield put(employeeSliceAction.updateProductFailed(error));
  }
}
export default function* employeeSaga() {
  yield takeLatest(employeeSliceAction.getListRequest, getListEmployee);
  yield takeLatest(employeeSliceAction.getByIdRequest, getByIdEmployee);
  yield takeLatest(employeeSliceAction.createRequest, createEmployee);
  yield takeLatest(employeeSliceAction.updateRequest, updateEmployee);
  yield takeLatest(employeeSliceAction.deleteRequest, deleteEmployee);
  yield takeLatest(employeeSliceAction.convertRequest, convertEmployee);
  yield takeLatest(employeeSliceAction.getMyEmployeeRequest, getMyEmployee);
  yield takeLatest(employeeSliceAction.addProductRequest, addProductEmployee);
  yield takeLatest(employeeSliceAction.updateProductRequest, updateProductEmployee);
  yield takeLatest(employeeSliceAction.removeProductRequest, removeProductEmployee);
}
