import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../staffGroups.api'; 
import { staffGroupsActions } from './reducer';

function* getListStaffGroups({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll, query);
    yield put(staffGroupsActions.getListSuccess(data));
  } catch (error:any) {
    yield put(staffGroupsActions.getListFailed(error));
  }
}

function* getByIdStaffGroups({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(staffGroupsActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(staffGroupsActions.getByIdFailed(error));
  }
}
function* getRoleByUser({ payload: query }: any): any {
  try {
    const data = yield call(api.getRoleByUser, query);
    yield put(staffGroupsActions.getRoleByUserSuccess(data));
  } catch (error: any) {
    yield put(staffGroupsActions.getRoleByUserFailed(error));
  }
}

function* createStaffGroups({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(staffGroupsActions.createSuccess(data));
    yield put(staffGroupsActions.getListRequest());
  } catch (error:any) {
    yield put(staffGroupsActions.createFailed(error));
  }
}

function* updateStaffGroups({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(staffGroupsActions.updateSuccess(data));
  } catch (error:any) {
    yield put(staffGroupsActions.updateFailed(error));
  }
}
function* deleteStaffGroups({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(staffGroupsActions.deleteSuccess(data));
    yield put(staffGroupsActions.getListRequest());
  } catch (error:any) {
    yield put(staffGroupsActions.deleteFailed(error));
  }
}

function* updateRoleByUser({payload} : any) : any {
  try {
    const data = yield call(api.updateRoleByUser,payload);
    yield put(staffGroupsActions.updateRoleUserSuccess(data));
  } catch (error:any) {
    yield put(staffGroupsActions.updateRoleUserFailed(error));
  }
}
function* removeRoleByUser({payload : id} : any) : any {
  try {
    const data = yield call(api.removeRoleByUser,id);
    yield put(staffGroupsActions.removeRoleUserSuccess(data));
  } catch (error:any) {
    yield put(staffGroupsActions.removeRoleUserFailed(error));
  }
}


export default function* staffGroupsSaga() {
  yield takeLatest(staffGroupsActions.getListRequest, getListStaffGroups);
  yield takeLatest(staffGroupsActions.getByIdRequest, getByIdStaffGroups);
  yield takeLatest(staffGroupsActions.getRoleByUserRequest, getRoleByUser);
  yield takeLatest(staffGroupsActions.createRequest, createStaffGroups);
  yield takeLatest(staffGroupsActions.updateRequest, updateStaffGroups);
  yield takeLatest(staffGroupsActions.deleteRequest, deleteStaffGroups);
  yield takeLatest(staffGroupsActions.updateRoleUserRequest, updateRoleByUser);
  yield takeLatest(staffGroupsActions.removeRoleUserRequest, removeRoleByUser);
}
