import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../customerSegmentation.api'; 
import { customerSegmentationActions } from './reducer';

function* getListCustomerSegmentation({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(customerSegmentationActions.getListSuccess(data));
    yield put(customerSegmentationActions.clearAction());
  } catch (error:any) {
    yield put(customerSegmentationActions.getListFailed(error));
  }
}

function* getByIdCustomerSegmentation({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(customerSegmentationActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(customerSegmentationActions.getByIdFailed(error));
  }
}

function* createCustomerSegmentation({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(customerSegmentationActions.createSuccess(data));
  } catch (error:any) {
    yield put(customerSegmentationActions.createFailed(error));
  }
}

function* updateCustomerSegmentation({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(customerSegmentationActions.updateSuccess(data));
  } catch (error:any) {
    yield put(customerSegmentationActions.updateFailed(error));
  }
}
function* deleteCustomerSegmentation({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(customerSegmentationActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(customerSegmentationActions.deleteFailed(error));
  }
}


export default function* customerSegmentationSaga() {
  yield takeLatest(customerSegmentationActions.getListRequest, getListCustomerSegmentation);
  yield takeLatest(customerSegmentationActions.getByIdRequest, getByIdCustomerSegmentation);
  yield takeLatest(customerSegmentationActions.createRequest, createCustomerSegmentation);
  yield takeLatest(customerSegmentationActions.updateRequest, updateCustomerSegmentation);
  yield takeLatest(customerSegmentationActions.deleteRequest, deleteCustomerSegmentation);
}
