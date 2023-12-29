import { put, call, takeLatest } from 'redux-saga/effects';
import {geoActions} from './reducer';
import api from '../geo.api'
function* getAreas() : any {
  try {
    const data = yield call(api.getAreas);
    yield put(geoActions.getAreasSuccess(data));
  } catch (error) {
    yield put(geoActions.getAreasFailed(error));
  }
}

function* getCities() : any {
  try {
    const data = yield call(api.getCities);
    yield put(geoActions.getCitiesSuccess(data));
  } catch (error) {
    yield put(geoActions.getCitiesFailed(error));
  }
}

function* getDistricts({ payload } : any) : any {
  try {
    const data = yield call(api.getDistricts, payload);
    yield put(geoActions.getDistrictsSuccess(data));
  } catch (error) {
    yield put(geoActions.getDistrictsFailed(error));
  }
}

function* getWards({ payload } : any)  : any{
  try {
    const data = yield call(api.getWards, payload);
    yield put(geoActions.getWardsSuccess(data));
  } catch (error) {
    yield put(geoActions.getWardsFailed(error));
  }
}





export default function* geoSaga() {
  yield takeLatest(geoActions.getAreasRequest, getAreas);
  yield takeLatest(geoActions.getCitiesRequest, getCities);
  yield takeLatest(geoActions.getDistrictsRequest, getDistricts);
  yield takeLatest(geoActions.getWardsRequest, getWards);
}
