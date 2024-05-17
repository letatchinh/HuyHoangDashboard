import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../reportSalaryPartner.api'; 
import { reportSalaryPartnerActions } from './reducer';

function* getListReportSalaryPartner({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(reportSalaryPartnerActions.getListSuccess(data));
  } catch (error:any) {
    yield put(reportSalaryPartnerActions.getListFailed(error));
  }
}

function* getByIdReportSalaryPartner({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(reportSalaryPartnerActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(reportSalaryPartnerActions.getByIdFailed(error));
  }
}

function* createReportSalaryPartner({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(reportSalaryPartnerActions.createSuccess(data));
  } catch (error:any) {
    yield put(reportSalaryPartnerActions.createFailed(error));
  }
}

function* updateReportSalaryPartner({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(reportSalaryPartnerActions.updateSuccess(data));
  } catch (error:any) {
    yield put(reportSalaryPartnerActions.updateFailed(error));
  }
}
function* deleteReportSalaryPartner({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(reportSalaryPartnerActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(reportSalaryPartnerActions.deleteFailed(error));
  }
}


export default function* reportSalaryPartnerSaga() {
  yield takeLatest(reportSalaryPartnerActions.getListRequest, getListReportSalaryPartner);
  yield takeLatest(reportSalaryPartnerActions.getByIdRequest, getByIdReportSalaryPartner);
  yield takeLatest(reportSalaryPartnerActions.createRequest, createReportSalaryPartner);
  yield takeLatest(reportSalaryPartnerActions.updateRequest, updateReportSalaryPartner);
  yield takeLatest(reportSalaryPartnerActions.deleteRequest, deleteReportSalaryPartner);
}
