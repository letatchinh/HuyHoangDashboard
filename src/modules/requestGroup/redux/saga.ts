import { put, call, takeLatest } from 'redux-saga/effects';
import { STATUS_REQUEST_GROUP } from '../constants';
import api from '../requestGroup.api'; 
import { ResultChangeType } from '../requestGroup.modal';
import { requestGroupActions } from './reducer';

function* getListRequestGroup({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(requestGroupActions.clearAction());
    yield put(requestGroupActions.getListSuccess(data));
  } catch (error:any) {
    yield put(requestGroupActions.getListFailed(error));
  }
}

function* getListRequestOfPartner({payload:query} : any) : any {
  try {
    const data = yield call(api.getByIdPartner,query);
    yield put(requestGroupActions.clearAction());
    yield put(requestGroupActions.getListRequestOfPartnerSuccess(data));
  } catch (error:any) {
    yield put(requestGroupActions.getListRequestOfPartnerFailed(error));
  }
}

// function* getByIdRequestGroup({payload:id} : any) : any {
//   try {
//     const data = yield call(api.getById,id);
//     yield put(requestGroupActions.getByIdSuccess(data));
//   } catch (error:any) {
//     yield put(requestGroupActions.getByIdFailed(error));
//   }
// }

function* changeStatus({payload} : any) : any {
  try {
    const {_id,status,...props} : {_id : string , status : keyof typeof STATUS_REQUEST_GROUP,data? : ResultChangeType} = payload;
    let request = {
      "PROCESSING" : {
        api : api.processing,
        payload : _id
      },
      "CANCELLED" : {
        api : api.cancel,
        payload : _id
      },
      "COMPLETED" : {
        api : api.completed,
        payload : {
          _id,
          ...props
        }
      },
      "NEW" : {
        api : () => {},
        payload : null,
      },
    }
    const data = yield call(request[status].api,request[status].payload);
  
    yield put(requestGroupActions.changeStatusSuccess(data));
  } catch (error:any) {
    console.log(error,'error');
    yield put(requestGroupActions.changeStatusFailed(error));
  }
}

function* createRequestGroup({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(requestGroupActions.createSuccess(data));
  } catch (error:any) {
    yield put(requestGroupActions.createFailed(error));
  }
}

// function* updateRequestGroup({payload} : any) : any {
//   try {
//     const data = yield call(api.update,payload);
//     yield put(requestGroupActions.updateSuccess(data));
//   } catch (error:any) {
//     yield put(requestGroupActions.updateFailed(error));
//   }
// }
// function* deleteRequestGroup({payload : id} : any) : any {
//   try {
//     const data = yield call(api.delete,id);
//     yield put(requestGroupActions.deleteSuccess(data));
//   } catch (error:any) {
//     yield put(requestGroupActions.deleteFailed(error));
//   }
// }


export default function* requestGroupSaga() {
  yield takeLatest(requestGroupActions.getListRequest, getListRequestGroup);
  yield takeLatest(requestGroupActions.getListRequestOfPartnerRequest, getListRequestOfPartner);
  // yield takeLatest(requestGroupActions.getByIdRequest, getByIdRequestGroup);
  yield takeLatest(requestGroupActions.createRequest, createRequestGroup);
  // yield takeLatest(requestGroupActions.updateRequest, updateRequestGroup);
  // yield takeLatest(requestGroupActions.deleteRequest, deleteRequestGroup);
  yield takeLatest(requestGroupActions.changeStatusRequest, changeStatus);
}
