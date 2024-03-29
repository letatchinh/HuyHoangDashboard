import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../baseSalary.api'; 
import { baseSalaryActions } from './reducer';

function* getListBaseSalary({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(baseSalaryActions.getListSuccess(data));
  } catch (error:any) {
    yield put(baseSalaryActions.getListFailed(error));
  }
}

function* getByIdBaseSalary({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(baseSalaryActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(baseSalaryActions.getByIdFailed(error));
  }
}

function* createBaseSalary({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(baseSalaryActions.createSuccess(data));
  } catch (error:any) {
    yield put(baseSalaryActions.createFailed(error));
  }
}

function* updateBaseSalary({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(baseSalaryActions.updateSuccess(data));
  } catch (error:any) {
    yield put(baseSalaryActions.updateFailed(error));
  }
}
function* deleteBaseSalary({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(baseSalaryActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(baseSalaryActions.deleteFailed(error));
  }
}


export default function* baseSalarySaga() {
  yield takeLatest(baseSalaryActions.getListRequest, getListBaseSalary);
  yield takeLatest(baseSalaryActions.getByIdRequest, getByIdBaseSalary);
  yield takeLatest(baseSalaryActions.createRequest, createBaseSalary);
  yield takeLatest(baseSalaryActions.updateRequest, updateBaseSalary);
  yield takeLatest(baseSalaryActions.deleteRequest, deleteBaseSalary);
}
