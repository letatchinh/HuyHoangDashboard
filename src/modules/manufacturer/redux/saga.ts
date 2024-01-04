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
};
function* getManufacturerById({payload:id}: any):any {
    try {
        const data = yield call(apis.getById,id);
        yield put(manufacturerSliceAction.getByIdSuccess(data));
    } catch (error:any) {
        yield put(manufacturerSliceAction.getByIdFailed(error));
    }
};
function* createManufacturer({payload}:any):any {
    try {
        const data = yield call(apis.create,payload);
        yield put(manufacturerSliceAction.createSuccess(data));
    } catch (error:any) {
        yield put(manufacturerSliceAction.createFailed(error));
    }
};
function* updateManufacturer({payload}:any):any {
    try {
        const data = yield call(apis.update,payload);
        yield put(manufacturerSliceAction.updateSuccess(data));
    } catch (error:any) {
        yield put(manufacturerSliceAction.updateFailed(error));
    }
};
function* deleteManufacturer({payload:id}:any):any {
    console.log('asdsd',id);
    try {
        const data = yield call(apis.delete,id);
        yield put(manufacturerSliceAction.deleteSuccess(data));
    } catch (error:any) {
        yield put(manufacturerSliceAction.deleteFailed(error));
    }
};
export default function* manufacturerSaga() {
    yield takeLatest(manufacturerSliceAction.getListRequest, getListManufacturer);
    yield takeLatest(manufacturerSliceAction.getByIdRequest, getManufacturerById);
    yield takeLatest(manufacturerSliceAction.updateRequest, updateManufacturer);
    yield takeLatest(manufacturerSliceAction.createRequest, createManufacturer);
    yield takeLatest(manufacturerSliceAction.deleteRequest, deleteManufacturer);
}