import { put, call, takeLatest } from 'redux-saga/effects'; 
import authModule from '~/modules/auth';
import { authActions } from './reducer';
import { ADAPTER_KEY } from '../constants';

function* login({ payload: user }: any) {
  try {
    const { token, branchId, adapter } = yield call(authModule.api.login, user);
    switch (adapter) { 
      case ADAPTER_KEY.EMPLOYEE:
        yield put(authActions.loginSuccess({token,branchId,adapter})); 
        break;
      case ADAPTER_KEY.STAFF: 
        yield put(authActions.loginSuccess({token,branchId,adapter})); 
        break; 
      case ADAPTER_KEY.PARTNER: 
        yield put(authActions.loginSuccess({token,branchId,adapter}));
        break;
        default:
        throw new Error('Invalid adapter'); 
    };
  } catch (error: any) {
    yield put(authActions.loginFailed(error));
  }
}

function* loginSuccess({ payload }: any) {
  try {
    // const profile = yield call(authModule.api.getProfile);
    yield put(authActions.getProfileRequest());
  } catch (error: any) {
    // yield put(authActions.loginFailed(error));
  }
}

function* getProfile({ payload: id }: any): any {
  try {
    const profile = yield call(authModule.api.getProfile, id);
    yield put(authActions.getProfileSuccess(profile));
  } catch (error: any) {
    yield put(authActions.getProfileFailed(error));
  }
}

export default function* userSaga() {
  yield takeLatest(authActions.loginRequest, login);
  yield takeLatest(authActions.loginSuccess, loginSuccess);
  yield takeLatest(authActions.getProfileRequest, getProfile);
}
