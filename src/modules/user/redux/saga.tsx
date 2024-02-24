import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../user.api'; 
import { userSliceAction } from './reducer';
import { setAxiosCompanyId } from '~/api/requester';

function* getListUser({ payload: query }: any): any {
  try {
    const data = yield call(api.getAll, query);
    yield put(userSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(userSliceAction.getListFailed(error));
  }
}

function* getByIdUser({payload:id} : any) : any {
  try {
    const data = yield call(api.getById, id);
    yield put(userSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(userSliceAction.getByIdFailed(error));
  }
}

function* createUser({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(userSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(userSliceAction.createFailed(error));
  }
}

function* updateUser({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(userSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(userSliceAction.updateFailed(error));
  }
}
function* deleteUser({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(userSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(userSliceAction.deleteFailed(error));
  }
};

function* getPolicy({ payload: branchId}: any): any {
  try {
    // setAxiosCompanyId(branchId);
    const policy = yield call(api.getPolicy, branchId);
    yield put(userSliceAction.getPolicySuccess(policy));
  } catch (error: any) {
    // setAxiosCompanyId(null);
    yield put(userSliceAction.getPolicyFailed(error));
  }
};

function* getProfile() : any {
  try {
    const data = yield call(api.getProfile);
    yield put(userSliceAction.getProfileSuccess(data));
  } catch (error:any) {
    yield put(userSliceAction.getProfileFailed(error));
  }
};

function* updateProfile({payload} : any) : any {
  try {
    const data = yield call(api.updateProfile,payload);
    yield put(userSliceAction.updateProfileSuccess(data));
  } catch (error:any) {
    yield put(userSliceAction.updateProfileFailed(error));
  }
};

export default function* userSaga() {
  yield takeLatest(userSliceAction.getListRequest, getListUser);
  yield takeLatest(userSliceAction.getByIdRequest, getByIdUser);
  yield takeLatest(userSliceAction.createRequest, createUser);
  yield takeLatest(userSliceAction.updateRequest, updateUser);
  yield takeLatest(userSliceAction.deleteRequest, deleteUser);
  yield takeLatest(userSliceAction.getPolicyRequest,getPolicy );
  yield takeLatest(userSliceAction.getProfileRequest,getProfile );
  yield takeLatest(userSliceAction.updateProfileRequest,updateProfile );
}
