import { call, put, takeLatest } from 'redux-saga/effects';
import api from '../benefitConfiguration.api';
import { benefitConfigurationActions } from './reducer';

function* getListBenefitConfiguration({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(benefitConfigurationActions.getListSuccess(data));
  } catch (error:any) {
    yield put(benefitConfigurationActions.getListFailed(error));
  }
}

function* getReportConfigBenefitTable({payload:query} : any) : any {
  try {
    const data = yield call(api.getConfigBenefitTable,query);
    yield put(benefitConfigurationActions.GetReportConfigBenefitTableSuccess(data));
  } catch (error:any) {
    yield put(benefitConfigurationActions.GetReportConfigBenefitTableRequestFailed(error));
  }
}

function* getReportConfigBenefitData({payload:query} : any) : any {
  try {
    const data = yield call(api.getConfigBenefitData,query);
    yield put(benefitConfigurationActions.GetReportConfigBenefitDataSuccess(data));
  } catch (error:any) {
    yield put(benefitConfigurationActions.GetReportConfigBenefitDataRequestFailed(error));
  }
}

function* getByIdBenefitConfiguration({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(benefitConfigurationActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(benefitConfigurationActions.getByIdFailed(error));
  }
}

function* createBenefitConfiguration({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(benefitConfigurationActions.createSuccess(data));
  } catch (error:any) {
    yield put(benefitConfigurationActions.createFailed(error));
  }
}

function* createCondition({payload} : any) : any {
  try {
    const data = yield call(api.createCondition,payload);
    yield put(benefitConfigurationActions.createConditionSuccess(data));
  } catch (error:any) {
    yield put(benefitConfigurationActions.createConditionFailed(error));
  }
}

function* updateCondition({payload} : any) : any {
  try {
    const data = yield call(api.updateCondition,payload);
    yield put(benefitConfigurationActions.updateConditionSuccess(data));
    const {callbackSubmit} = payload;
    callbackSubmit && callbackSubmit();
  } catch (error:any) {
    yield put(benefitConfigurationActions.updateConditionFailed(error));
  }
}

function* deleteCondition({payload} : any) : any {
  try {
    const data = yield call(api.deleteCondition,payload);
    yield put(benefitConfigurationActions.deleteConditionSuccess(data));
    const {callbackSubmit} = payload;
    callbackSubmit && callbackSubmit();
  } catch (error:any) {
    yield put(benefitConfigurationActions.deleteConditionFailed(error));
  }
}

function* createBenefit({payload} : any) : any {
  try {
    const data = yield call(api.createBenefit,payload);
    yield put(benefitConfigurationActions.createBenefitSuccess(data));
    const {callbackSubmit} = payload;
    callbackSubmit && callbackSubmit();
  } catch (error:any) {
    yield put(benefitConfigurationActions.createBenefitFailed(error));
  }
}

function* deleteBenefit({payload} : any) : any {
  try {
    const data = yield call(api.deleteBenefit,payload);
    yield put(benefitConfigurationActions.deleteBenefitSuccess(data));
    const {callbackSubmit} = payload;
    callbackSubmit && callbackSubmit();
  } catch (error:any) {
    yield put(benefitConfigurationActions.deleteBenefitFailed(error));
  }
}

function* createConfig({payload} : any) : any {
  try {
    const data = yield call(api.createConfig,payload);
    yield put(benefitConfigurationActions.createConfigSuccess(data));
  } catch (error:any) {
    yield put(benefitConfigurationActions.createConfigFailed(error));
  }
}

function* updateBenefitConfiguration({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(benefitConfigurationActions.updateSuccess(data));
  } catch (error:any) {
    yield put(benefitConfigurationActions.updateFailed(error));
  }
}
function* deleteBenefitConfiguration({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(benefitConfigurationActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(benefitConfigurationActions.deleteFailed(error));
  }
}


export default function* benefitConfigurationSaga() {
  yield takeLatest(benefitConfigurationActions.getListRequest, getListBenefitConfiguration);
  yield takeLatest(benefitConfigurationActions.getByIdRequest, getByIdBenefitConfiguration);
  yield takeLatest(benefitConfigurationActions.createRequest, createBenefitConfiguration);
  yield takeLatest(benefitConfigurationActions.updateRequest, updateBenefitConfiguration);
  yield takeLatest(benefitConfigurationActions.deleteRequest, deleteBenefitConfiguration);
  yield takeLatest(benefitConfigurationActions.GetReportConfigBenefitTableRequest, getReportConfigBenefitTable);
  yield takeLatest(benefitConfigurationActions.GetReportConfigBenefitDataRequest, getReportConfigBenefitData);
  yield takeLatest(benefitConfigurationActions.createConditionRequest, createCondition);
  yield takeLatest(benefitConfigurationActions.updateConditionRequest, updateCondition);
  yield takeLatest(benefitConfigurationActions.deleteConditionRequest, deleteCondition);
  yield takeLatest(benefitConfigurationActions.createBenefitRequest, createBenefit);
  yield takeLatest(benefitConfigurationActions.deleteBenefitRequest, deleteBenefit);
  yield takeLatest(benefitConfigurationActions.createConfigRequest, createConfig);
}
