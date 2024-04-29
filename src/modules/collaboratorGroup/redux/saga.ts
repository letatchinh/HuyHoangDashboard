import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../collaboratorGroup.api'; 
import { collaboratorGroupActions } from './reducer';

function* getListCollaboratorGroup({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(collaboratorGroupActions.getListSuccess(data));
  } catch (error:any) {
    yield put(collaboratorGroupActions.getListFailed(error));
  }
}

function* getByIdCollaboratorGroup({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(collaboratorGroupActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(collaboratorGroupActions.getByIdFailed(error));
  }
}

function* createCollaboratorGroup({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(collaboratorGroupActions.createSuccess(data));
  } catch (error:any) {
    yield put(collaboratorGroupActions.createFailed(error));
  }
}

function* updateCollaboratorGroup({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(collaboratorGroupActions.updateSuccess(data));
  } catch (error:any) {
    yield put(collaboratorGroupActions.updateFailed(error));
  }
}
function* deleteCollaboratorGroup({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(collaboratorGroupActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(collaboratorGroupActions.deleteFailed(error));
  }
}


export default function* collaboratorGroupSaga() {
  yield takeLatest(collaboratorGroupActions.getListRequest, getListCollaboratorGroup);
  yield takeLatest(collaboratorGroupActions.getByIdRequest, getByIdCollaboratorGroup);
  yield takeLatest(collaboratorGroupActions.createRequest, createCollaboratorGroup);
  yield takeLatest(collaboratorGroupActions.updateRequest, updateCollaboratorGroup);
  yield takeLatest(collaboratorGroupActions.deleteRequest, deleteCollaboratorGroup);
}
