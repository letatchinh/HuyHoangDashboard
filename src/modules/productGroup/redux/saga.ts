import { call, put, takeLatest} from 'redux-saga/effects';
import { productGroupSliceAction } from './reducer';
import apis from '../productGroup.api';
function* getListProductConfig({payload:query}: any):any {
    try {
         const data = yield call(apis.getAll,query);
    yield put(productGroupSliceAction.getListSuccess(data));
    } catch (error:any) {
       yield put(productGroupSliceAction.getListFailed(error)); 
    }
   
}

function* getProductConfigById({payload:id}: any):any {
    try {
         const data = yield call(apis.getById,id);
    yield put(productGroupSliceAction.getByIdSuccess(data));
    } catch (error:any) {
       yield put(productGroupSliceAction.getByIdFailed(error)); 
    }
}
function* updateListProduct({payload}:any):any {
    try {
        const data = yield call(apis.update,payload);
        yield put(productGroupSliceAction.updateSuccess(data));
    } catch (error:any) {
        yield put(productGroupSliceAction.updateFailed(error));
    }
    
}
function * updateProductConfig({payload}:any):any {
    try {
        const data = yield call(apis.update,payload);
        yield put(productGroupSliceAction.updateSuccess(data));
    } catch (error:any) {
        yield put(productGroupSliceAction.updateFailed(error));
    }
    
}
function* createProductConfig({payload}:any):any {
    try {
        const data = yield call(apis.create,payload);
        yield put(productGroupSliceAction.createSuccess(data));
    } catch (error:any) {
        yield put(productGroupSliceAction.createFailed(error));
    }
    
}
function* deleteProductConfig({payload:id}:any):any {
    try {
        const data = yield call(apis.delete,id);
        yield put(productGroupSliceAction.deleteSuccess(data));
    } catch (error:any) {
        yield put(productGroupSliceAction.deleteFailed(error));
    }
    
}
export default function* productConfigSaga() {
    yield takeLatest(productGroupSliceAction.getListRequest, getListProductConfig);
    yield takeLatest(productGroupSliceAction.getByIdRequest, getProductConfigById);
    yield takeLatest(productGroupSliceAction.updateRequest, updateProductConfig);
    yield takeLatest(productGroupSliceAction.createRequest, createProductConfig);
    yield takeLatest(productGroupSliceAction.deleteRequest, deleteProductConfig);
}