import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../ranking.api'; 
import { rankingSliceAction } from './reducer';

function* getListRanking({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(rankingSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(rankingSliceAction.getListFailed(error));
  }
}

function* getByIdRanking({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(rankingSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(rankingSliceAction.getByIdFailed(error));
  }
}

function* createRanking({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(rankingSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(rankingSliceAction.createFailed(error));
  }
}

function* updateRanking({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(rankingSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(rankingSliceAction.updateFailed(error));
  }
}
function* deleteRanking({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(rankingSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(rankingSliceAction.deleteFailed(error));
  }
}


export default function* rankingSaga() {
  yield takeLatest(rankingSliceAction.getListRequest, getListRanking);
  yield takeLatest(rankingSliceAction.getByIdRequest, getByIdRanking);
  yield takeLatest(rankingSliceAction.createRequest, createRanking);
  yield takeLatest(rankingSliceAction.updateRequest, updateRanking);
  yield takeLatest(rankingSliceAction.deleteRequest, deleteRanking);
}
