import { get } from 'lodash';
import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../quotation.api'; 
import { quotationActions } from './reducer';

function* getListQuotation({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(quotationActions.getListSuccess(data));
  } catch (error:any) {
    yield put(quotationActions.getListFailed(error));
  }
}

function* getByIdQuotation({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(quotationActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(quotationActions.getByIdFailed(error));
  }
}

function* createQuotation({payload} : any) : any {
  try {
    const {callbackSubmit,...params} = payload
    const data = yield call(api.create,params);
    if(callbackSubmit){
      callbackSubmit({
        type : 'createQuotation',
        code : get(data,'code')
      })
    }
    yield put(quotationActions.createSuccess(data));
  } catch (error:any) {
    yield put(quotationActions.createFailed(error));
  }
}

function* updateQuotation({payload} : any) : any {
  try {
    const {callbackSubmit,...params} = payload
    const data = yield call(api.update,params);
    if(callbackSubmit){
      callbackSubmit({
        type : 'updateQuotation',
        code : get(data,'code')
      })
    }
    yield put(quotationActions.updateSuccess(data));
  } catch (error:any) {
    yield put(quotationActions.updateFailed(error));
  }
}

function* convertQuotation({payload} : any) : any {
  try {
    const {callbackSubmit,...params} = payload
    const data = yield call(api.convert,params);
    if(callbackSubmit){
      callbackSubmit({
        type : 'convertQuotation',
        code : get(data,'code')
      })
    }
    yield put(quotationActions.convertSuccess(data));
  } catch (error:any) {
    yield put(quotationActions.convertFailed(error));
  }
}
function* deleteQuotation({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(quotationActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(quotationActions.deleteFailed(error));
  }
}


export default function* quotationSaga() {
  yield takeLatest(quotationActions.getListRequest, getListQuotation);
  yield takeLatest(quotationActions.getByIdRequest, getByIdQuotation);
  yield takeLatest(quotationActions.createRequest, createQuotation);
  yield takeLatest(quotationActions.updateRequest, updateQuotation);
  yield takeLatest(quotationActions.convertRequest, convertQuotation);
  yield takeLatest(quotationActions.deleteRequest, deleteQuotation);
}
