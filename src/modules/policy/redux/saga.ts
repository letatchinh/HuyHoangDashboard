import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../policy.api'; 
import { policyActions } from './reducer';

function* getListPolicy({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(policyActions.getListSuccess(data));
  } catch (error:any) {
    yield put(policyActions.getListFailed(error));
  }
}

function* getByIdPolicy({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(policyActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(policyActions.getByIdFailed(error));
  }
}

function* createPolicy({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(policyActions.createSuccess(data));
  } catch (error:any) {
    yield put(policyActions.createFailed(error));
  }
}

function* updatePolicy({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(policyActions.updateSuccess(data));
  } catch (error:any) {
    yield put(policyActions.updateFailed(error));
  }
}
function* deletePolicy({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(policyActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(policyActions.deleteFailed(error));
  }
}


export default function* policySaga() {
  yield takeLatest(policyActions.getListRequest, getListPolicy);
  yield takeLatest(policyActions.getByIdRequest, getByIdPolicy);
  yield takeLatest(policyActions.createRequest, createPolicy);
  yield takeLatest(policyActions.updateRequest, updatePolicy);
  yield takeLatest(policyActions.deleteRequest, deletePolicy);
}
