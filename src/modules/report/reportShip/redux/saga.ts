import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../reportShip.api'; 
import { reportShipActions } from './reducer';

function* getListReportShip({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(reportShipActions.getListSuccess(data));
    yield put(reportShipActions.clearAction());
  } catch (error:any) {
    yield put(reportShipActions.getListFailed(error));
  }
}
function* getSummaryShip({payload:query} : any) : any {
  try {
    const data = yield call(api.getSummary,query);
    yield put(reportShipActions.getSummarySuccess(data));
  } catch (error:any) {
    yield put(reportShipActions.getSummaryFailed(error));
  }
}



export default function* reportShipSaga() {
  yield takeLatest(reportShipActions.getListRequest, getListReportShip);
  yield takeLatest(reportShipActions.getSummaryRequest, getSummaryShip);
}
