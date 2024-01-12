import { call, put, takeLatest} from 'redux-saga/effects';
import { productConfigSliceAction } from './reducer';
import apis from '../productConfig.api';
function* getListProductConfig({payload:query}: any):any {
    try {
         const data = yield call(apis.getAll,query);
    yield put(productConfigSliceAction.getListSuccess(data));
    } catch (error:any) {
       yield put(productConfigSliceAction.getListFailed(error)); 
    }
   
}

function* getProductConfigById({payload:id}: any):any {
    try {
         const data = yield call(apis.getById,id);
    yield put(productConfigSliceAction.getByIdSuccess(data));
    } catch (error:any) {
       yield put(productConfigSliceAction.getByIdFailed(error)); 
    }
}
function* updateListProduct({payload}:any):any {
    try {
        const data = yield call(apis.update,payload);
        yield put(productConfigSliceAction.updateSuccess(data));
    } catch (error:any) {
        yield put(productConfigSliceAction.updateFailed(error));
    }
    
}
function * updateProductConfig({payload}:any):any {
    try {
        const data = yield call(apis.update,payload);
        yield put(productConfigSliceAction.updateSuccess(data));
    } catch (error:any) {
        yield put(productConfigSliceAction.updateFailed(error));
    }
    
}
function* createProductConfig({payload}:any):any {
    try {
        const data = yield call(apis.create,payload);
        yield put(productConfigSliceAction.createSuccess(data));
    } catch (error:any) {
        yield put(productConfigSliceAction.createFailed(error));
    }
    
}
function* deleteProductConfig({payload:id}:any):any {
    console.log(id);
    try {
        const data = yield call(apis.delete,id);
        yield put(productConfigSliceAction.deleteSuccess(data));
    } catch (error:any) {
        yield put(productConfigSliceAction.deleteFailed(error));
    }
    
}
export default function* productConfigSaga() {
    yield takeLatest(productConfigSliceAction.getListRequest, getListProductConfig);
    yield takeLatest(productConfigSliceAction.getByIdRequest, getProductConfigById);
    yield takeLatest(productConfigSliceAction.updateRequest, updateProductConfig);
    yield takeLatest(productConfigSliceAction.createRequest, createProductConfig);
    yield takeLatest(productConfigSliceAction.deleteRequest, deleteProductConfig);
}