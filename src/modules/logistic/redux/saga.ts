import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../logistic.api'; 
import { logisticActions } from './reducer';

function* getListLogistic({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(logisticActions.getListSuccess(data));
  } catch (error:any) {
    yield put(logisticActions.getListFailed(error));
  }
}

function* getByIdLogistic({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(logisticActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(logisticActions.getByIdFailed(error));
  }
}

function* createLogistic({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(logisticActions.createSuccess(data));
  } catch (error:any) {
    yield put(logisticActions.createFailed(error));
  }
}

function* updateLogistic({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(logisticActions.updateSuccess(data));
  } catch (error:any) {
    yield put(logisticActions.updateFailed(error));
  }
}
function* deleteLogistic({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(logisticActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(logisticActions.deleteFailed(error));
  }
};

function* countFee({payload} : any) : any {
  try {
    const data = yield call(api.countFee,payload);
    yield put(logisticActions.countFeeSuccess({...data, note: payload?.note}));
  } catch (error:any) {
    yield put(logisticActions.countFeeFailed(error));
  }
}


export default function* logisticSaga() {
  yield takeLatest(logisticActions.getListRequest, getListLogistic);
  yield takeLatest(logisticActions.getByIdRequest, getByIdLogistic);
  yield takeLatest(logisticActions.createRequest, createLogistic);
  yield takeLatest(logisticActions.updateRequest, updateLogistic);
  yield takeLatest(logisticActions.deleteRequest, deleteLogistic);

  yield takeLatest(logisticActions.countFeeRequest, countFee);
}
