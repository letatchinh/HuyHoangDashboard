import { call, put, takeLatest} from 'redux-saga/effects';
import apis from '../manufacturer.api';
import { manufacturerSliceAction } from './reducer';

function* getListManufacturer({payload:query}: any):any {
    try {
        const data = yield call(apis.getAll,query);
        yield put(manufacturerSliceAction.getListSuccess(data));
    } catch (error:any) {
        yield put(manufacturerSliceAction.getListFailed(error));
    }
}

export default function* manufacturerSaga() {
    yield takeLatest(manufacturerSliceAction.getListRequest, getListManufacturer);
}