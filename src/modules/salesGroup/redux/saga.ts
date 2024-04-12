import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../salesGroup.api'; 
import { salesGroupActions } from './reducer';
import { get, omit } from 'lodash';

function* getListSalesGroup({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(salesGroupActions.getListSuccess(data));
  } catch (error:any) {
    yield put(salesGroupActions.getListFailed(error));
  }
}

function* getListTeamLeadSalesGroup({payload:query} : any) : any {
  try {
    const data = yield call(api.getListTeamLead,query);
    yield put(salesGroupActions.getListTeamLeadSuccess(data));
  } catch (error:any) {
    yield put(salesGroupActions.getListTeamLeadFailed(error));
  }
}
function* getListMemberSalesGroup({payload:query} : any) : any {
  try {
    const data = yield call(api.getListMember,query);
    yield put(salesGroupActions.getListMemberSuccess(data));
  } catch (error:any) {
    yield put(salesGroupActions.getListMemberFailed(error));
  }
}

function* getByIdSalesGroup({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(salesGroupActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(salesGroupActions.getByIdFailed(error));
  }
}

function* createSalesGroup({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(salesGroupActions.createSuccess(data));
  } catch (error:any) {
    yield put(salesGroupActions.createFailed(error));
  }
}

function* updateSalesGroup({payload} : any) : any {
  try {
    const data = yield call(api.update,omit(payload,'callback'));
    if (typeof get(payload, 'callback', '') === 'function') {
      payload.callback()
    };
    yield put(salesGroupActions.updateSuccess(data));
  } catch (error:any) {
    yield put(salesGroupActions.updateFailed(error));
  }
}
function* deleteSalesGroup({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(salesGroupActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(salesGroupActions.deleteFailed(error));
  }
}


export default function* salesGroupSaga() {
  yield takeLatest(salesGroupActions.getListRequest, getListSalesGroup);
  yield takeLatest(salesGroupActions.getListTeamLeadRequest, getListTeamLeadSalesGroup);
  yield takeLatest(salesGroupActions.getListMemberRequest, getListMemberSalesGroup);
  yield takeLatest(salesGroupActions.getByIdRequest, getByIdSalesGroup);
  yield takeLatest(salesGroupActions.createRequest, createSalesGroup);
  yield takeLatest(salesGroupActions.updateRequest, updateSalesGroup);
  yield takeLatest(salesGroupActions.deleteRequest, deleteSalesGroup);
}
