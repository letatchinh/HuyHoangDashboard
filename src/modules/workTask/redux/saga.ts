import { put, call, takeLatest, select } from "redux-saga/effects";
import api from "../workTask.api";
import { workTaskSliceAction } from "./reducer";
import { get } from "lodash";

function* getListWorkTask({ payload: query }: any): any {
  try {
    const data = yield call(api.getAll, query);
    yield put(workTaskSliceAction.getListSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.getListFailed(error));
  }
};

function* getByIdWorkTask({ payload: id }: any): any {
  try {
    const data = yield call(api.getById, id);
    yield put(workTaskSliceAction.getByIdSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.getByIdFailed(error));
  }
};

function* createWorkTask({ payload }: any): any {
  try {
    const data = yield call(api.create, payload);
    yield put(workTaskSliceAction.createSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.createFailed(error));
  }
};

function* updateWorkTask({ payload }: any): any {
  try {
    const data = yield call(api.update, payload);
    yield put(workTaskSliceAction.updateSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.updateFailed(error));
  }
};
function* deleteWorkTask({ payload: id }: any): any {
  try {
    const data = yield call(api.delete, id);
    yield put(workTaskSliceAction.deleteSuccess(data));
  } catch (error: any) {
    yield put(workTaskSliceAction.deleteFailed(error));
  }
};

function* updateTask({ payload }: any): any {
  try {
      const data = yield call(api.updateTask, payload);
      console.log(data)
      yield put( workTaskSliceAction.updateSuccess(get(data.data, 'boardConfigId')));
      // yield put({ type: Types.UPDATE_TASK_INIT_SUCCESS, payload: {dataTask:data.data,boardId: get(data.data, 'boardConfigId'),idTask :get(data.data,'_id')}});
      // const profile = yield select((state) => state.user.profile);
      // const response= get(data,'data')
      // const managers = yield call(Api.workFlow.getAllManagersByIdBoard, get(response, 'boardId'));
      // const res = yield call(Api.workFlow.getByIdTask, get(response, '_id'));
    
      // Check if User is a Super admin or manager assigned
      // if (!!get(profile, 'isSuperAdmin') || managers?.some(item => get(item, '_id') === get(profile, '_id'))) {
      //     yield put({ type: Types.UPDATE_TASK_SUCCESS, payload: { ...response, progressListShow: get(response, 'progressList') } });
      // } else {
      //     const progressListShow = get(response, 'progressList', [])?.map(item => {
      //         let progressShow = get(item, 'progress', [])?.filter(progress => get(progress, '[0].assign', '')?.includes(get(profile, '_id'))||get(progress, '[0].assign', '')==='');
      //         return { ...item, progress: progressShow }
      //     });
      //     yield put({ type: Types.UPDATE_TASK_SUCCESS, payload: { ...response, progressListShow } });
      // }
  } catch (error) {
      yield put(workTaskSliceAction.updateFailed(error));
  }
};

//history
function* getHistoryActivityTaskById({ payload }: any) : any {
  try {
      const data = yield call(api.getHistoryTaskById, payload.id);
      yield put(workTaskSliceAction.getHistoryActivityTaskByIdSuccess(data));
  } catch (error: any) {
      yield put(workTaskSliceAction.getHistoryActivityTaskByIdFailed(error));
  };
};

function* updateProgressTask({ payload }: any): any {
  try {
      const data = yield call(api.updateProgressTask, payload);
      const profile = yield select((state) => state.user.profile);
      const response = get(data, 'data');
      const managers = yield call(api.getAllManagersByIdBoard, get(response, 'boardId'));
      // Check if User is a Super admin or manager assigned
      if (!!get(profile, 'isSuperAdmin') || managers?.some((item: any) => get(item, '_id') === get(profile, '_id'))) {
        yield put(workTaskSliceAction.updateProgressTaskSuccess({ ...response, progressListShow: get(response, 'progressList') }));
      } else {
          const progressListShow = get(response, 'progressList', [])?.map((item: any) => {
              let progressShow = get(item, 'progress', [])?.filter((progress: any) => get(progress, '[0].assign', '')?.includes(get(profile, '_id'))||get(progress, '[0].assign', '')==='');
            return { ...item, progress: progressShow };
          });
        yield put(workTaskSliceAction.updateProgressTaskSuccess({ ...response, progressListShow }));
    };
  } catch (error: any) {
      yield put(workTaskSliceAction.updateProgressTaskFailed(error));
  }
}
function* copyTask ({ payload }: any): any {
  try {
      const data = yield call(api.copyTask, payload);
      yield put(workTaskSliceAction.copyTaskSuccess(data?.data));
      // yield put({ type: Types.ADD_BOARD_CONFIG_ITEM_REQUEST, payload: { id: data?.data.boardConfigId } }); action getWorkListConfig
  } catch (error: any) {
      yield put(workTaskSliceAction.copyTaskFailed(error));
  };
};


export default function* workTaskSaga() {
  //Get
  yield takeLatest(workTaskSliceAction.getListRequest, getListWorkTask);
  yield takeLatest(workTaskSliceAction.getByIdRequest, getByIdWorkTask);
  yield takeLatest(workTaskSliceAction.getHistoryActivityTaskByIdRequest, getHistoryActivityTaskById);
  // yield takeLatest(workTaskSliceAction.getWorkListConfig, getWorkListConfig);

  //Create
  yield takeLatest(workTaskSliceAction.createRequest, createWorkTask);
  yield takeLatest(workTaskSliceAction.copyTaskRequest, copyTask);

  //Update
  yield takeLatest(workTaskSliceAction.updateRequest, updateWorkTask);
  yield takeLatest(workTaskSliceAction.updateProgressTaskRequest, updateProgressTask);

  //Delete
  yield takeLatest(workTaskSliceAction.deleteRequest, deleteWorkTask);
};
