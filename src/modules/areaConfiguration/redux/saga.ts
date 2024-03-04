import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../areaConfiguration.api'; 
import { areaConfigurationActions } from './reducer';

function* getListAreaConfiguration({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(areaConfigurationActions.getListSuccess(data));
  } catch (error:any) {
    yield put(areaConfigurationActions.getListFailed(error));
  }
}

function* getByIdAreaConfiguration({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(areaConfigurationActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(areaConfigurationActions.getByIdFailed(error));
  }
}

function* createAreaConfiguration({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(areaConfigurationActions.createSuccess(data));
  } catch (error:any) {
    yield put(areaConfigurationActions.createFailed(error));
  }
}

function* updateAreaConfiguration({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(areaConfigurationActions.updateSuccess(data));
  } catch (error:any) {
    yield put(areaConfigurationActions.updateFailed(error));
  }
}
function* deleteAreaConfiguration({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(areaConfigurationActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(areaConfigurationActions.deleteFailed(error));
  }
}


export default function* areaConfigurationSaga() {
  yield takeLatest(areaConfigurationActions.getListRequest, getListAreaConfiguration);
  yield takeLatest(areaConfigurationActions.getByIdRequest, getByIdAreaConfiguration);
  yield takeLatest(areaConfigurationActions.createRequest, createAreaConfiguration);
  yield takeLatest(areaConfigurationActions.updateRequest, updateAreaConfiguration);
  yield takeLatest(areaConfigurationActions.deleteRequest, deleteAreaConfiguration);
}
