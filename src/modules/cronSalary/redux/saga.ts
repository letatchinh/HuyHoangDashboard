import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../cronSalary.api'; 
import { cronSalaryActions } from './reducer';

function* getListCronSalary({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(cronSalaryActions.getListSuccess(data));
  } catch (error:any) {
    yield put(cronSalaryActions.getListFailed(error));
  }
}

function* getByIdCronSalary({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(cronSalaryActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(cronSalaryActions.getByIdFailed(error));
  }
}

function* createCronSalary({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(cronSalaryActions.createSuccess(data));
  } catch (error:any) {
    yield put(cronSalaryActions.createFailed(error));
  }
}

function* updateCronSalary({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(cronSalaryActions.updateSuccess(data));
  } catch (error:any) {
    yield put(cronSalaryActions.updateFailed(error));
  }
}
function* deleteCronSalary({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(cronSalaryActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(cronSalaryActions.deleteFailed(error));
  }
}


export default function* cronSalarySaga() {
  yield takeLatest(cronSalaryActions.getListRequest, getListCronSalary);
  yield takeLatest(cronSalaryActions.getByIdRequest, getByIdCronSalary);
  yield takeLatest(cronSalaryActions.createRequest, createCronSalary);
  yield takeLatest(cronSalaryActions.updateRequest, updateCronSalary);
  yield takeLatest(cronSalaryActions.deleteRequest, deleteCronSalary);
}
