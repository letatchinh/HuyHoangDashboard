import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../reportOverview.api'; 
import { reportOverviewActions } from './reducer';

function* getListReportOverview({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(reportOverviewActions.getListSuccess(data));
  } catch (error:any) {
    yield put(reportOverviewActions.getListFailed(error));
  }
}

function* getByIdReportOverview({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(reportOverviewActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(reportOverviewActions.getByIdFailed(error));
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

function* updateReportOverview({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(reportOverviewActions.updateSuccess(data));
  } catch (error:any) {
    yield put(reportOverviewActions.updateFailed(error));
  }
}
function* deleteReportOverview({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(reportOverviewActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(reportOverviewActions.deleteFailed(error));
  }
}


export default function* reportOverviewSaga() {
  yield takeLatest(reportOverviewActions.getListRequest, getListReportOverview);
  yield takeLatest(reportOverviewActions.getByIdRequest, getByIdReportOverview);
  yield takeLatest(reportOverviewActions.createRequest, createReportOverview);
  yield takeLatest(reportOverviewActions.updateRequest, updateReportOverview);
  yield takeLatest(reportOverviewActions.deleteRequest, deleteReportOverview);
}
