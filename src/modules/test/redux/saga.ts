import { call, put, takeLatest } from "redux-saga/effects";
import { testActions } from "./reducer";


function* getTestList() {
    try {
        const data = yield call(() => new Promise((resolve) => resolve([])))
        yield put(testActions.getListSuccess(data))

    } catch (error) {
        console.error(error)
        yield put(testActions.getListFailed(error))
    }
}

export default function* testSaga() {
    yield takeLatest(testActions.getListRequest, getTestList)
}