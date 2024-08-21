import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../reportSubFee.api'; 
import { reportSubFeeActions } from './reducer';

function* getListReportSubFee({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(reportSubFeeActions.getListSuccess(data));
    yield put(reportSubFeeActions.clearAction());
  } catch (error:any) {
    yield put(reportSubFeeActions.getListFailed(error));
  }
}
function* getSummarySubFee({payload:query} : any) : any {
  try {
    const data = yield call(api.getSummary,query);
    yield put(reportSubFeeActions.getSummarySuccess(data));
  } catch (error:any) {
    yield put(reportSubFeeActions.getSummaryFailed(error));
  }
}



export default function* reportSubFeeSaga() {
  yield takeLatest(reportSubFeeActions.getListRequest, getListReportSubFee);
  yield takeLatest(reportSubFeeActions.getSummaryRequest, getSummarySubFee);
}
