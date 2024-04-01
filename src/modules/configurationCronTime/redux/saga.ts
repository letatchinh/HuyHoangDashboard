import { put, call, takeLatest } from "redux-saga/effects";
import api from "../configurationCronTime.api";
import { configurationCronTimeActions } from "./reducer";

function* getListConfigurationCronTime({ payload: id }: any): any {
  try {
    const data = yield call(api.getAll, id);
    yield put(configurationCronTimeActions.getListSuccess(data));
  } catch (error: any) {
    yield put(configurationCronTimeActions.getListFailed(error));
  }
}

// function* getByIdConfigurationCronTime({payload:id} : any) : any {
//   try {
//     const data = yield call(api.getById,id);
//     yield put(configurationCronTimeActions.getByIdSuccess(data));
//   } catch (error:any) {
//     yield put(configurationCronTimeActions.getByIdFailed(error));
//   }
// }

// function* createConfigurationCronTime({payload} : any) : any {
//   try {
//     const data = yield call(api.create,payload);
//     yield put(configurationCronTimeActions.createSuccess(data));
//   } catch (error:any) {
//     yield put(configurationCronTimeActions.createFailed(error));
//   }
// }

function* updateConfigurationCronTime({ payload }: any): any {
  try {
    const data = yield call(api.update, payload);
    yield put(configurationCronTimeActions.updateSuccess(data));
  } catch (error: any) {
    yield put(configurationCronTimeActions.updateFailed(error));
  }
}
// function* deleteConfigurationCronTime({payload : id} : any) : any {
//   try {
//     const data = yield call(api.delete,id);
//     yield put(configurationCronTimeActions.deleteSuccess(data));
//   } catch (error:any) {
//     yield put(configurationCronTimeActions.deleteFailed(error));
//   }
// }

export default function* configurationCronTimeSaga() {
  yield takeLatest(
    configurationCronTimeActions.getListRequest,
    getListConfigurationCronTime
  );
  // yield takeLatest(configurationCronTimeActions.getByIdRequest, getByIdConfigurationCronTime);
  // yield takeLatest(configurationCronTimeActions.createRequest, createConfigurationCronTime);
  yield takeLatest(
    configurationCronTimeActions.updateRequest,
    updateConfigurationCronTime
  );
  // yield takeLatest(configurationCronTimeActions.deleteRequest, deleteConfigurationCronTime);
}
