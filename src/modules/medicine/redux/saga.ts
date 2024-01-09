import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../medicine.api'; 
import { medicineSliceAction } from './reducer';

function* getListMedicine({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(medicineSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(medicineSliceAction.getListFailed(error));
  }
}

function* getByIdMedicine({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(medicineSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(medicineSliceAction.getByIdFailed(error));
  }
}

function* createMedicine({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(medicineSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(medicineSliceAction.createFailed(error));
  }
}

function* updateMedicine({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(medicineSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(medicineSliceAction.updateFailed(error));
  }
}
function* deleteMedicine({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(medicineSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(medicineSliceAction.deleteFailed(error));
  }
}


export default function* medicineSaga() {
  yield takeLatest(medicineSliceAction.getListRequest, getListMedicine);
  yield takeLatest(medicineSliceAction.getByIdRequest, getByIdMedicine);
  yield takeLatest(medicineSliceAction.createRequest, createMedicine);
  yield takeLatest(medicineSliceAction.updateRequest, updateMedicine);
  yield takeLatest(medicineSliceAction.deleteRequest, deleteMedicine);
}
