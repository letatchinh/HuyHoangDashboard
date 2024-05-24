import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../reportIndividualCollaborator.api'; 
import { reportIndividualCollaboratorActions } from './reducer';

function* getListReportIndividualCollaborator({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(reportIndividualCollaboratorActions.getListSuccess(data));
    yield put(reportIndividualCollaboratorActions.clearAction());
  } catch (error:any) {
    yield put(reportIndividualCollaboratorActions.getListFailed(error));
  }
}

function* getByIdReportIndividualCollaborator({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(reportIndividualCollaboratorActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(reportIndividualCollaboratorActions.getByIdFailed(error));
  }
}

function* createReportIndividualCollaborator({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(reportIndividualCollaboratorActions.createSuccess(data));
  } catch (error:any) {
    yield put(reportIndividualCollaboratorActions.createFailed(error));
  }
}

function* updateReportIndividualCollaborator({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(reportIndividualCollaboratorActions.updateSuccess(data));
  } catch (error:any) {
    yield put(reportIndividualCollaboratorActions.updateFailed(error));
  }
}
function* deleteReportIndividualCollaborator({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(reportIndividualCollaboratorActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(reportIndividualCollaboratorActions.deleteFailed(error));
  }
}


export default function* reportIndividualCollaboratorSaga() {
  yield takeLatest(reportIndividualCollaboratorActions.getListRequest, getListReportIndividualCollaborator);
  yield takeLatest(reportIndividualCollaboratorActions.getByIdRequest, getByIdReportIndividualCollaborator);
  yield takeLatest(reportIndividualCollaboratorActions.createRequest, createReportIndividualCollaborator);
  yield takeLatest(reportIndividualCollaboratorActions.updateRequest, updateReportIndividualCollaborator);
  yield takeLatest(reportIndividualCollaboratorActions.deleteRequest, deleteReportIndividualCollaborator);
}
