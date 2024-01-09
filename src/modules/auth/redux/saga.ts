import { put, call, takeLatest } from 'redux-saga/effects'; 
import authModule from '~/modules/auth';
import { authActions } from './reducer';

function* login({ payload: user }: any){
  try {
    const { token, branchId } = yield call(authModule.api.login, user);
    yield put(authActions.loginSuccess({token,branchId}));
  } catch (error: any) {
    yield put(authActions.loginFailed(error));
  }
}

function* loginSuccess({ payload } : any) {
  try {
    // const profile = yield call(authModule.api.getProfile);
    yield put(authActions.getProfileRequest());
  } catch (error: any) {
    // yield put(authActions.loginFailed(error));
  }
}

function* getProfile({payload : id} : any): any {
  try {
    console.log(11111)
    const profile = yield call(authModule.api.getProfile,id);
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
