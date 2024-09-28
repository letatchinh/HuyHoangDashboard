import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../auth.api'; 
import { authActions } from './reducer';

function* login({ payload: user }: any) {
  try {
    const { token } = yield call(api.login, user);
    yield put(authActions.loginSuccess({token})); 
  } catch (error: any) {
    yield put(authActions.loginFailed(error));
  }
}

function* loginSuccess({ payload }: any) {
  try {
    console.log(1)
    yield put(authActions.getProfileRequest());
    console.log(2)
  } catch (error: any) {
    yield put(authActions.loginFailed(error));
  }
}

function* getProfile({ payload: id }: any): any {
  try {
    const profile = yield call(api.getProfile, id);
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
