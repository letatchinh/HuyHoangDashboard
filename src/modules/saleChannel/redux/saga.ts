import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../saleChannel.api'; 
import { saleChannelSliceAction } from './reducer';

function* getListSaleChannel({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(saleChannelSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(saleChannelSliceAction.getListFailed(error));
  }
}

function* getByIdSaleChannel({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(saleChannelSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(saleChannelSliceAction.getByIdFailed(error));
  }
}

function* createSaleChannel({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(saleChannelSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(saleChannelSliceAction.createFailed(error));
  }
}

function* updateSaleChannel({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(saleChannelSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(saleChannelSliceAction.updateFailed(error));
  }
}
function* deleteSaleChannel({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(saleChannelSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(saleChannelSliceAction.deleteFailed(error));
  }
}


export default function* saleChannelSaga() {
  yield takeLatest(saleChannelSliceAction.getListRequest, getListSaleChannel);
  yield takeLatest(saleChannelSliceAction.getByIdRequest, getByIdSaleChannel);
  yield takeLatest(saleChannelSliceAction.createRequest, createSaleChannel);
  yield takeLatest(saleChannelSliceAction.updateRequest, updateSaleChannel);
  yield takeLatest(saleChannelSliceAction.deleteRequest, deleteSaleChannel);
}
