import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../costManagement.api'; 
import { costManagementActions } from './reducer';

function* getListCostManagement({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(costManagementActions.getListSuccess(data));
  } catch (error:any) {
    yield put(costManagementActions.getListFailed(error));
  }
}

function* getByIdCostManagement({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(costManagementActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(costManagementActions.getByIdFailed(error));
  }
}

function* createCostManagement({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(costManagementActions.createSuccess(data));
  } catch (error:any) {
    yield put(costManagementActions.createFailed(error));
  }
}

function* updateCostManagement({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(costManagementActions.updateSuccess(data));
  } catch (error:any) {
    yield put(costManagementActions.updateFailed(error));
  }
}
function* deleteCostManagement({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(costManagementActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(costManagementActions.deleteFailed(error));
  }
}


export default function* costManagementSaga() {
  yield takeLatest(costManagementActions.getListRequest, getListCostManagement);
  yield takeLatest(costManagementActions.getByIdRequest, getByIdCostManagement);
  yield takeLatest(costManagementActions.createRequest, createCostManagement);
  yield takeLatest(costManagementActions.updateRequest, updateCostManagement);
  yield takeLatest(costManagementActions.deleteRequest, deleteCostManagement);
}
