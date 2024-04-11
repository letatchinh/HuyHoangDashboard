import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../collaborator.api'; 
import { collaboratorActions } from './reducer';

function* getListCollaborator({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(collaboratorActions.getListSuccess(data));
  } catch (error:any) {
    yield put(collaboratorActions.getListFailed(error));
  }
}

function* getByIdCollaborator({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(collaboratorActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(collaboratorActions.getByIdFailed(error));
  }
}

function* createCollaborator({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(collaboratorActions.createSuccess(data));
  } catch (error:any) {
    yield put(collaboratorActions.createFailed(error));
  }
}

function* updateCollaborator({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(collaboratorActions.updateSuccess(data));
  } catch (error:any) {
    yield put(collaboratorActions.updateFailed(error));
  }
}
function* deleteCollaborator({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(collaboratorActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(collaboratorActions.deleteFailed(error));
  }
}

function* convertCollaborator({payload} : any) : any {
  try {
    const data = yield call(api.convert, payload);
    yield put(collaboratorActions.convertSuccess(data));
  } catch (error: any) {
    yield put(collaboratorActions.convertFailed(error));
  }
}

export default function* collaboratorSaga() {
  yield takeLatest(collaboratorActions.getListRequest, getListCollaborator);
  yield takeLatest(collaboratorActions.getByIdRequest, getByIdCollaborator);
  yield takeLatest(collaboratorActions.createRequest, createCollaborator);
  yield takeLatest(collaboratorActions.updateRequest, updateCollaborator);
  yield takeLatest(collaboratorActions.deleteRequest, deleteCollaborator);
  yield takeLatest(collaboratorActions.convertRequest, convertCollaborator);
}
