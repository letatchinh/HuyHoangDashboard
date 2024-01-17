// import { TaskRelationOption } from "./../../../../.history/src/modules/workTask/components/RrelationTask_20240116151409";
import { put, call, takeLatest, select } from "redux-saga/effects";
import api from "../workTask.api";
import { workTaskSliceAction } from "./reducer";
import { get } from "lodash";
import { Empty } from "antd";
import { workListActions } from "~/modules/workList/redux/reducer";
function* getListWorkTask({ payload: query }: any): any {
  try {
    const data = yield call(api.getAll, query);
    yield put(workTaskSliceAction.getListSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.getListFailed(error));
  }
}

function* getByIdWorkTask({ payload: id }: any): any {
  try {
    const data = yield call(api.getById, id);
    yield put(workTaskSliceAction.getByIdSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.getByIdFailed(error));
  }
}

function* createWorkTask({ payload }: any): any {
  try {
    const data = yield call(api.create,payload);
    yield put(workTaskSliceAction.createSuccess(data));
    const dataType:any ={ id: payload.boardConfigId } 
    yield put(workListActions.addBoardConfigItemRequest(dataType))
  } catch (error:any) {
    yield put(workTaskSliceAction.createFailed(error));
  }
}

// function* updateWorkTask({ payload }: any): any {
//   try {
//     const data = yield call(api.update, payload);
//     const dataType:any = get(data.data, 'boardConfigId') 
//     yield put(workListActions.addBoardConfigItemRequest(dataType))
//     yield put(workTaskSliceAction.updateSuccess(data));
//   } catch (error: any) {
//     yield put(workTaskSliceAction.updateFailed(error));
//   }
// }
function* deleteWorkTask({payload} : any) : any {
  try {
    const data = yield call(api.delete,payload.id);
    yield put(workTaskSliceAction.deleteSuccess(data));
    const dataType:any ={ id: payload.boardConfigId } 
    yield put(workListActions.addBoardConfigItemRequest(dataType))
  } catch (error:any) {
    yield put(workTaskSliceAction.deleteFailed(error));
  }
}

function* updateTask({ payload }: any): any {
  try {
    const data = yield call(api.updateTask, payload);
        yield put(workListActions.addBoardConfigItemSuccess(get(data.data, 'boardConfigId')));
        // yield put(workListActions.update(get(data.data, 'boardConfigId')));
        const profile = yield select((state) => state.user.profile);
        const response = get(data, 'data');
        const managers = yield call(api.getAllManagersByIdBoard, get(response, 'boardId'));
        if (
          !!get(profile?.user, 'isSuperAdmin') ||
          managers?.some((item: any) => get(item, '_id') === get(profile, '_id'))
        ) {
          yield put( workTaskSliceAction.updateSuccess( get(response, 'progressList')));
        }else {
          const progressListShow = get(response, 'progressList', [])?.map(
            (item: any) => {
              let progressShow = get(item, 'progress', [])?.filter(
                (progress: any) =>
                  get(progress, '[0].assign', '')?.includes(get(profile, '_id')) ||
                  get(progress, '[0].assign', '') === ''
              );
              return { ...item, progress: progressShow };
            }
          );
          yield put(workTaskSliceAction.updateSuccess({...response, progressListShow }));
         };
} catch (error) {
    yield put(workTaskSliceAction.updateFailed(error));
  };
};
//history
function* getHistoryActivityTaskById({ payload }: any): any {
  try {
    const data = yield call(api.getHistoryTaskById, payload.id);
    yield put(workTaskSliceAction.getHistoryActivityTaskByIdSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.getHistoryActivityTaskByIdFailed(error));
  }
}

function* updateProgressTask({ payload }: any): any {
  try {
    const data = yield call(api.updateProgressTask, payload);
    const profile = yield select((state) => state.user.profile);
    const response = get(data, "data");
    const managers = yield call(
      api.getAllManagersByIdBoard,
      get(response, "boardId")
    );
    // Check if User is a Super admin or manager assigned
    if (
      !!get(profile, "isSuperAdmin") ||
      managers?.some((item: any) => get(item, "_id") === get(profile, "_id"))
    ) {
      yield put(
        workTaskSliceAction.updateProgressTaskSuccess({
          ...response,
          progressListShow: get(response, "progressList"),
        })
      );
    } else {
      const progressListShow = get(response, "progressList", [])?.map(
        (item: any) => {
          let progressShow = get(item, "progress", [])?.filter(
            (progress: any) =>
              get(progress, "[0].assign", "")?.includes(get(profile, "_id")) ||
              get(progress, "[0].assign", "") === ""
          );
          return { ...item, progress: progressShow };
        }
      );
      yield put(
        workTaskSliceAction.updateProgressTaskSuccess({
          ...response,
          progressListShow,
        })
      );
      // yield put({ type: Types.UPDATE_TASK_SUCCESS, payload: { ...response, progressListShow } });
    }
  } catch (error: any) {
    yield put(workTaskSliceAction.updateProgressTaskFailed(error));
  }
}
function* copyTask({ payload }: any): any {
  try {
    const data = yield call(api.copyTask, payload);
    yield put(workTaskSliceAction.copyTaskSuccess(data?.data));
    // yield put({ type: Types.ADD_BOARD_CONFIG_ITEM_REQUEST, payload: { id: data?.data.boardConfigId } }); action getWorkListConfig
  } catch (error: any) {
    yield put(workTaskSliceAction.copyTaskFailed(error));
  }
}

function* searchTaskItemTask({ payload }: any): any {
  try {
    const data = yield call(api.searchTaskByBoardId, payload);
    // let convertDatatoOption : any = data.map((task: any)=>({
    //   value:task._id,
    //   label:<TaskRelationOption task={task}/>
    // }));

    // if (!data?.length) {
    //   convertDatatoOption = [{
    //     value: 'unkow',
    //     label: <Empty style = {{width: 40}} />}]
    // };
    // payload.action(convertDatatoOption)
    yield put(workTaskSliceAction.searchTaskSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.searchTaskFailed(error));
  }
}

function* getRelationTaskItemTask({ payload }: any): any {
  try {
    const data = yield call(api.getRelationTask, get(payload, "taskId", ""));
    yield put(workTaskSliceAction.getRelationTaskSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.getRelationTaskFailed(error));
  }
}

function* updateRelationTaskItemTask({ payload }: any): any {
  try {
    const data = yield call(api.updateRelationTask, payload);
    const listTask = yield call(
      api.getRelationTask,
      get(payload, "taskItemId", "")
    );
    yield put(workTaskSliceAction.getRelationTaskSuccess(listTask));
    yield put(workTaskSliceAction.updateRelationTaskSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.updateRelationTaskFailed(error));
  }
};
function* onAssign({ payload }: any): any{
  try {
      const data = yield call(api.updateTask, payload);
      yield put(workTaskSliceAction.assignTaskSuccess(data));
  } catch (error: any) {
      yield put(workTaskSliceAction.assignTaskFailed(error));
  }
};

//COMMENT
function* commentPushTask({payload}: any): any{
  try {
    const data = yield call(api.pushComment, payload);
    yield put(workTaskSliceAction.commentSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.commentFailed(error));
  }
};

function* pushEmtionTask({payload}: any): any{
  try {
    const data = yield call(api.pushEmotion, payload);
    // yield put();
  } catch (error: any) {
    console.log(error)
    // yield put({ type: Types.EMOTION_FAILED, payload: error.message });
  }
};
function* deleteCommentTask({payload}: any): any{
  try {
    const data = yield call(api.deleteComment, payload);
    yield put(workTaskSliceAction.commentSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.commentFailed(error));
  }
};
function* updateCommentTask({payload}: any): any{
  try {
    const data = yield call(api.updateCommentById, payload);
    // yield put(workTaskSliceAction.commen);
  } catch (error: any) {
    console.log(error)
    // yield put({ type: Types.COMMENT_UPDATE_FAILED, payload: error.message });
  }
};
//

export default function* workTaskSaga() {
  //Get
  yield takeLatest(workTaskSliceAction.getListRequest, getListWorkTask);
  yield takeLatest(workTaskSliceAction.getByIdRequest, getByIdWorkTask);
  yield takeLatest(
    workTaskSliceAction.getHistoryActivityTaskByIdRequest,
    getHistoryActivityTaskById
  );
  yield takeLatest(workTaskSliceAction.searchTaskRequest, searchTaskItemTask);
  yield takeLatest(workTaskSliceAction.assignTaskRequest, onAssign);
  yield takeLatest(
    workTaskSliceAction.getRelationTaskRequest,
    getRelationTaskItemTask
  );
  yield takeLatest(
    workTaskSliceAction.updateRelationTaskRequest,
    updateRelationTaskItemTask
  );

  //Create
  yield takeLatest(workTaskSliceAction.createRequest, createWorkTask);
  yield takeLatest(workTaskSliceAction.copyTaskRequest, copyTask);

  //Update
  // yield takeLatest(workTaskSliceAction.updateRequest, updateTask);
  yield takeLatest(workTaskSliceAction.updateRequest, updateTask);
  yield takeLatest(workTaskSliceAction.updateCommentRequest, updateCommentTask);
  yield takeLatest(workTaskSliceAction.pushEmotionRequest, pushEmtionTask);
  yield takeLatest(
    workTaskSliceAction.updateProgressTaskRequest,
    updateProgressTask
  );
  yield takeLatest(workTaskSliceAction.commentRequest, commentPushTask);

  //Delete
  yield takeLatest(workTaskSliceAction.deleteRequest, deleteWorkTask);
  yield takeLatest(workTaskSliceAction.deleteCommentRequest, deleteCommentTask);
  
}
