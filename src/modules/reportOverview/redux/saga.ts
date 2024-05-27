import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../reportOverview.api'; 
import { reportOverviewActions } from './reducer';

function* getListReportOverview({payload:query} : any) : any {
  try {
    const data = yield call(api.getListData,query);
    yield put(reportOverviewActions.getListSuccess(data));
  } catch (error:any) {
    yield put(reportOverviewActions.getListFailed(error));
  }
}


function* createReportOverview({payload} : any) : any {
  try {
    const data = yield call(api.getOverview,payload);
    yield put(reportOverviewActions.createSuccess(data));
  } catch (error:any) {
    yield put(reportOverviewActions.createFailed(error));
  }
}


export default function* reportOverviewSaga() {
  yield takeLatest(reportOverviewActions.getListRequest, getListReportOverview);
  yield takeLatest(reportOverviewActions.createRequest, createReportOverview);
}
