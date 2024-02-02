import { put, call, takeLatest } from 'redux-saga/effects';
import { getExistProp } from '~/utils/helpers';
import api from '../lk.api'; 
import { lkActions } from './reducer';

function* getListLk({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,getExistProp(query));
    yield put(lkActions.getListSuccess(data));
  } catch (error:any) {
    yield put(lkActions.getListFailed(error));
  }
}



export default function* lkSaga() {
  yield takeLatest(lkActions.getListRequest, getListLk);
}
