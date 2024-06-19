import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../reportIndividualEmployeeSeller.api'; 
import { reportIndividualEmployeeSellerActions } from './reducer';

function* getListReportIndividualEmployeeSeller({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(reportIndividualEmployeeSellerActions.getListSuccess(data));
    yield put(reportIndividualEmployeeSellerActions.clearAction());
  } catch (error:any) {
    yield put(reportIndividualEmployeeSellerActions.getListFailed(error));
  }
}

function* getByIdReportIndividualEmployeeSeller({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(reportIndividualEmployeeSellerActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(reportIndividualEmployeeSellerActions.getByIdFailed(error));
  }
}

function* createReportIndividualEmployeeSeller({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(reportIndividualEmployeeSellerActions.createSuccess(data));
  } catch (error:any) {
    yield put(reportIndividualEmployeeSellerActions.createFailed(error));
  }
}

function* updateReportIndividualEmployeeSeller({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(reportIndividualEmployeeSellerActions.updateSuccess(data));
  } catch (error:any) {
    yield put(reportIndividualEmployeeSellerActions.updateFailed(error));
  }
}
function* deleteReportIndividualEmployeeSeller({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(reportIndividualEmployeeSellerActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(reportIndividualEmployeeSellerActions.deleteFailed(error));
  }
}


export default function* reportIndividualEmployeeSellerSaga() {
  yield takeLatest(reportIndividualEmployeeSellerActions.getListRequest, getListReportIndividualEmployeeSeller);
  yield takeLatest(reportIndividualEmployeeSellerActions.getByIdRequest, getByIdReportIndividualEmployeeSeller);
  yield takeLatest(reportIndividualEmployeeSellerActions.createRequest, createReportIndividualEmployeeSeller);
  yield takeLatest(reportIndividualEmployeeSellerActions.updateRequest, updateReportIndividualEmployeeSeller);
  yield takeLatest(reportIndividualEmployeeSellerActions.deleteRequest, deleteReportIndividualEmployeeSeller);
}
