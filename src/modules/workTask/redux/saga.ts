import { put, call, takeLatest } from 'redux-saga/effects';
import api from '../workTask.api'; 
import { workTaskActions } from './reducer';
import { workListActions } from '~/modules/workList/redux/reducer';

function* getListWorkTask({payload:query} : any) : any {
  try {
    const data = yield call(api.getAll,query);
    yield put(workTaskActions.getListSuccess(data));
  } catch (error:any) {
    yield put(workTaskActions.getListFailed(error));
  }
}

function* getByIdWorkTask({payload:id} : any) : any {
  try {
    const data = yield call(api.getById,id);
    yield put(workTaskActions.getByIdSuccess(data));
  } catch (error:any) {
    yield put(workTaskActions.getByIdFailed(error));
  }
}

function* createWorkTask({payload} : any) : any {
  try {
    const data = yield call(api.create,payload);
    yield put(workTaskActions.createSuccess(data));
    const dataType:any ={ id: payload.boardConfigId } 
    yield put(workListActions.addBoardConfigItemRequest(dataType))
  } catch (error:any) {
    yield put(workTaskActions.createFailed(error));
  }
}

function* updateWorkTask({payload} : any) : any {
  try {
    const data = yield call(api.update,payload);
    yield put(workTaskActions.updateSuccess(data));
  } catch (error:any) {
    yield put(workTaskActions.updateFailed(error));
  }
}
function* deleteWorkTask({payload} : any) : any {
  try {
    const data = yield call(api.delete,payload.id);
    yield put(workTaskActions.deleteSuccess(data));
    const dataType:any ={ id: payload.boardConfigId } 
    yield put(workListActions.addBoardConfigItemRequest(dataType))
  } catch (error:any) {
    yield put(workTaskActions.deleteFailed(error));
  }
}
// function* copyTask ({ payload }:any):any {
//   try {
//       const data = yield call(api.copyTask, payload);
//       yield put({type:Types.COPY_TASK_SUCCESS,payload:{data:data?.data}});
//       yield put({ type: Types.ADD_BOARD_CONFIG_ITEM_REQUEST, payload: { id: data?.data.boardConfigId } });
//   } catch (error) {
//       yield put({ type: Types.COPY_TASK_FAILED, payload: error });
//   }
// }
// function* getHistoryActivityTaskById({ payload }: any):any {
//   try {
//       const data = yield call(api.getHistoryTaskById, payload.id);
//       yield put({ type: Types.GET_HISTORY_ACTIVITY_SUCCESS, payload: data });
//   } catch (error:any) {
//       yield put({ type: Types.GET_HISTORY_ACTIVITY_FAILED, payload: error.message });
//   }
// }

// function* onAssign({ payload }: any):any {
//   try {
//       const data = yield call(api.update, payload);
//       yield put({ type: Types.ASSIGN_TASK_SUCCESS, payload: data });
//   } catch (error) {
//       yield put({ type: Types.ASSIGN_TASK_FAILED, payload: error });
//   }
// }
// function* commentPushTask({payload}){
//   try {
//     const data = yield call(api.pushComment, payload);
//     yield put({ type: Types.COMMENT_SUCCESS, payload: data });
//   } catch (error:any) {
//     yield put({ type: Types.COMMENT_FAILED, payload: error.message });
//   }
// }

// function* pushEmtionTask({payload}:any):any{
//   try {
//     const data = yield call(api.pushEmotion, payload);
//     yield put({ type: Types.EMOTION_SUCCESS, payload: data });
//   } catch (error:any) {
//     yield put({ type: Types.EMOTION_FAILED, payload: error.message });
//   }
// }
// function* deleteCommentTask({payload}:any):any{
//   try {
//     const data = yield call(api.deleteComment, payload);
//     yield put({ type: Types.COMMENT_DELETE_SUCCESS, payload: data });
//   } catch (error:any) {
//     yield put({ type: Types.COMMENT_DELETE_FAILED, payload: error.message });
//   }
// }
// function* updateCommentTask({payload}){
//   try {
//     const data = yield call(api.updateCommentById, payload);
//     yield put({ type: Types.COMMENT_UPDATE_SUCCESS, payload: data });
//   } catch (error) {
//     yield put({ type: Types.COMMENT_UPDATE_FAILED, payload: error.message });
//   }
// }
export default function* workTaskSaga() {
  yield takeLatest(workTaskActions.getListRequest, getListWorkTask);
  yield takeLatest(workTaskActions.getByIdRequest, getByIdWorkTask);
  yield takeLatest(workTaskActions.createRequest, createWorkTask);
  yield takeLatest(workTaskActions.updateRequest, updateWorkTask);
  yield takeLatest(workTaskActions.deleteRequest, deleteWorkTask);
}
