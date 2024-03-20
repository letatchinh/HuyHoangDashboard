import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../freelanceContractPharmacy.api'; 
import { freelanceContractPharmacyActions } from './reducer';

function* getListFreelanceContractPharmacy({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(freelanceContractPharmacyActions.getListSuccess(data));
  } catch (error:any) {
    yield put(freelanceContractPharmacyActions.getListFailed(error));
  }
}

function* getByIdFreelanceContractPharmacy({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(freelanceContractPharmacyActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(freelanceContractPharmacyActions.getByIdFailed(error));
  }
}

function* createFreelanceContractPharmacy({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(freelanceContractPharmacyActions.createSuccess(data));
  } catch (error:any) {
    yield put(freelanceContractPharmacyActions.createFailed(error));
  }
}

function* updateFreelanceContractPharmacy({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(freelanceContractPharmacyActions.updateSuccess(data));
  } catch (error:any) {
    yield put(freelanceContractPharmacyActions.updateFailed(error));
  }
}
function* deleteFreelanceContractPharmacy({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(freelanceContractPharmacyActions.deleteSuccess(data));
  } catch (error:any) {
    yield put(freelanceContractPharmacyActions.deleteFailed(error));
  }
}


export default function* freelanceContractPharmacySaga() {
  yield takeLatest(freelanceContractPharmacyActions.getListRequest, getListFreelanceContractPharmacy);
  yield takeLatest(freelanceContractPharmacyActions.getByIdRequest, getByIdFreelanceContractPharmacy);
  yield takeLatest(freelanceContractPharmacyActions.createRequest, createFreelanceContractPharmacy);
  yield takeLatest(freelanceContractPharmacyActions.updateRequest, updateFreelanceContractPharmacy);
  yield takeLatest(freelanceContractPharmacyActions.deleteRequest, deleteFreelanceContractPharmacy);
}
