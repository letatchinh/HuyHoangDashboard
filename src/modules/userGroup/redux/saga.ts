import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../userGroup.api'; 
import { userGroupSliceAction } from './reducer';

function* getListUserGroup({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(userGroupSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(userGroupSliceAction.getListFailed(error));
  }
}

function* getByIdUserGroup({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(userGroupSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(userGroupSliceAction.getByIdFailed(error));
  }
}

function* createUserGroup({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(userGroupSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(userGroupSliceAction.createFailed(error));
  }
}

function* updateUserGroup({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(userGroupSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(userGroupSliceAction.updateFailed(error));
  }
}
function* deleteUserGroup({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(userGroupSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(userGroupSliceAction.deleteFailed(error));
  }
}


export default function* userGroupSaga() {
  yield takeLatest(userGroupSliceAction.getListRequest, getListUserGroup);
  yield takeLatest(userGroupSliceAction.getByIdRequest, getByIdUserGroup);
  yield takeLatest(userGroupSliceAction.createRequest, createUserGroup);
  yield takeLatest(userGroupSliceAction.updateRequest, updateUserGroup);
  yield takeLatest(userGroupSliceAction.deleteRequest, deleteUserGroup);
}
