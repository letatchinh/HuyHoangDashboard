import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../homepage.api'; 
import { homepageSliceAction } from './reducer';

function* getListHomepage({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(homepageSliceAction.getListSuccess(data));
  } catch (error:any) {
    yield put(homepageSliceAction.getListFailed(error));
  }
}

function* getByIdHomepage({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(homepageSliceAction.getByIdSuccess(data));
  } catch (error:any) {
    yield put(homepageSliceAction.getByIdFailed(error));
  }
}

function* createHomepage({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(homepageSliceAction.createSuccess(data));
  } catch (error:any) {
    yield put(homepageSliceAction.createFailed(error));
  }
}

function* updateHomepage({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(homepageSliceAction.updateSuccess(data));
  } catch (error:any) {
    yield put(homepageSliceAction.updateFailed(error));
  }
}
function* deleteHomepage({payload : id} : any) : any {
  try {
    const data = yield call(api.delete,id);
    yield put(homepageSliceAction.deleteSuccess(data));
  } catch (error:any) {
    yield put(homepageSliceAction.deleteFailed(error));
  }
}


export default function* homepageSaga() {
  yield takeLatest(homepageSliceAction.getListRequest, getListHomepage);
  yield takeLatest(homepageSliceAction.getByIdRequest, getByIdHomepage);
  yield takeLatest(homepageSliceAction.createRequest, createHomepage);
  yield takeLatest(homepageSliceAction.updateRequest, updateHomepage);
  yield takeLatest(homepageSliceAction.deleteRequest, deleteHomepage);
}
