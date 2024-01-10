import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../policy.api'; 
import { policySliceAction } from './reducer';
import apis from '../policy.api';

function* getListPolicy({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(policySliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(policySliceAction.getListFailed(error));
  }
};

function* getResources({ payload: query }: any): any {
  try {
    const data = yield call(api.getAll, query);
    yield put(policySliceAction.getResourcesSuccess(data));
  } catch (error: any) {
    yield put(policySliceAction.getResourcesFailed(error));
  }
};

function* getByIdPolicy({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(policySliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(policySliceAction.getByIdFailed(error));
  }
}

function* createPolicy({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(policySliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(policySliceAction.createFailed(error));
  }
}

function* updatePolicy({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(policySliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(policySliceAction.updateFailed(error));
  }
}
function* deletePolicy({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(policySliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(policySliceAction.deleteFailed(error));
  }
};

function* updateGroupPermission({ payload }: any) {
  try {
    const { isAssgined, companyId, groupId, ...rest } = payload;
    const request = isAssgined
      ? api.update
      : api.delete;

    yield call(request, { ...rest, groupId });

    // I Remove Refetch because Now Dont need to ReFetch data because I Used CloneData
    // yield put({ 
    //   type: Types.GET_EMPLOYEE_GROUP_REQUEST,
    //   payload: { companyId, groupId }
    // });

    yield put(policySliceAction.updateSuccess);
  } catch (error) {
    yield put(policySliceAction.updateFailed(error));
  }
}

export default function* policySaga() {
  yield takeLatest(policySliceAction.getListRequest, getListPolicy);
  yield takeLatest(policySliceAction.getByIdRequest, getByIdPolicy);
  yield takeLatest(policySliceAction.createRequest, createPolicy);
  yield takeLatest(policySliceAction.updateRequest, updatePolicy);
  yield takeLatest(policySliceAction.deleteRequest, deletePolicy);
  yield takeLatest(policySliceAction.getResourcesRequest, getResources);
  yield takeLatest(policySliceAction.updateResourcesRequest, updateGroupPermission);
}
