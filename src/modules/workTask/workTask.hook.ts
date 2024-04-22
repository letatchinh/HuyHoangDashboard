import { get, isArray,} from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp} from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetch,
  useFetchByParam,
  useQueryParams,
  useResetState,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { useDispatch } from "react-redux";
import { BASE_URL, DEFAULT_BRANCH_ID } from "~/constants/defaultValue";
import { workTaskSliceAction } from "./redux/reducer";
const MODULE  = "workTask";
const MODULE_VI  = "Nhân viên";

const {
  loadingSelector,
  listSelector,
  getListFailedSelector,
  getByIdLoadingSelector,
  getByIdSelector,
  getByIdFailedSelector,
  deleteSuccessSelector,
  deleteFailedSelector,
  isSubmitLoadingSelector,
  createSuccessSelector,
  createFailedSelector,
  updateSuccessSelector,
  updateFailedSelector,
  pagingSelector,
} = getSelectors(MODULE);
export const useGetPagingTodoList = () => useSelector(pagingSelector);

const getSelector = (key: string) => (state: any) => state[MODULE][key];
const listTaskSelector = getSelector('listTask');
const listComment = getSelector('listComment');
const getTaskByIdSelector = getSelector('taskById');
const ListHistoryActivity = getSelector('listHistory')
const listRelation = getSelector('listTaskRelation');
const getSearchListTaskFailed = getSelector('getSearchListTaskFailed');
const getListTaskRelationFailed = getSelector('getListTaskRelationFailed')
const loadingHistoryActivity = getSelector('isLoadingHistory')
const loadingGetTaskRelation = getSelector('isloadingRelationTask')
const isLoadingComment = getSelector('isLoadingComment')
const getListHistoryFailed = getSelector('getListHistoryFailed');

const assignFailedSelector = getSelector('assignFailed');
const isLoadingAssignSelector = getSelector('isLoadingAssign');
const updateProgressSuccessSelector = getSelector('updateProgressSuccess');
const updateProgressFailedSelector = getSelector('updateProgressFailed');

export const useGetAllTask = (param:any) => {
  return useFetchByParam({
    action: workTaskSliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetTaskById = (id: any) => {
  return useFetchByParam({
    action: workTaskSliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id
  });
};

export const useCreateTask = (callback?: any) => {
  useSuccess(createSuccessSelector, 'Tạo mới công việc thành công', callback);
  useFailed(createFailedSelector, 'Tạo mới công việc thất bại');

  return useSubmit({
    loadingSelector: isSubmitLoadingSelector,
    action: workTaskSliceAction.createRequest
  })
};


export const useWorkTaskQueryParams = (module: any) => {
  
  const prevKeyword = useRef(null);
  const query = useQueryParams();
  const branchId = query.get('branchId') || DEFAULT_BRANCH_ID;
  const keyword = query.get('keyword');
  const page = query.get('page') || 1;
  const limit = query.get('limit') || 10;
  const key = query.get('key');
  const tabs = query.get('tabs');
  const taskId = query.get('taskId')
  const status = query.get("status");
  const startDate = query.get("startDate") || null;
  const endDate = query.get("endDate") || null;

  const createSuccess = useSelector(createSuccessSelector);
  const updateSuccess = useSelector(updateSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
   
  return useMemo(() => {
    const queryParams = getExistProp({
      keyword,
      status,
      key,
      tabs,
      taskId,
      page,
      limit,
      branchId,
      startDate,
      endDate
    });
    return [queryParams]
  }, [keyword, branchId, status, key, keyword, page, limit, taskId, tabs, startDate, endDate, createSuccess, updateSuccess, deleteSuccess]);
   
};

export const useUpdateWorkTaskParams = (
  query: any,
  listOptionSearch?: any[]
) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [keyword, setKeyword] = useState(get(query, "keyword"));
  useEffect(() => {
    setKeyword(get(query, "keyword"));
  }, [query]);
  const onParamChange = (param: any) => {
    // Clear Search Query when change Params
    clearQuerySearch(listOptionSearch, query, param);

    if (!param.page) {
      query.page = 1;
    };

    // Convert Query and Params to Search Url Param
    const searchString = new URLSearchParams(
      getExistProp({
        ...query,
        ...param,
      })
    ).toString();

    // Navigate
    navigate(`${pathname}?${searchString}`);
  };

  return [keyword, { setKeyword, onParamChange }];
};

export const useUpdateTask = (callback?: any) => {
  useSuccess(updateSuccessSelector, 'Cập nhật công việc thành công', callback);
  useFailed(updateFailedSelector, 'Cập nhật công việc thất baị');
  return useSubmit({
    loadingSelector: isSubmitLoadingSelector,
    action: workTaskSliceAction.updateRequest,
  })
};
export const useUpdateTaskInit =()=>{
  return useSubmit({
    loadingSelector:isSubmitLoadingSelector,
    action: workTaskSliceAction.updateRequest,
  })
}

//historySpentTime 
export const useGetHistoryActivityTaskById = (query: any) => {
  return useFetchByParam({
    action: workTaskSliceAction.getHistoryActivityTaskByIdRequest,
    loadingSelector: loadingHistoryActivity,
    dataSelector: ListHistoryActivity,
    failedSelector: getListHistoryFailed,
    param: query
  })
};
export const useUpdateProgress = (callback?: any) => {
  useSuccess(updateProgressSuccessSelector, 'Cập nhật công việc thành công', callback);
  useFailed(updateProgressFailedSelector);
  return useSubmit({
    loadingSelector: isSubmitLoadingSelector,
    action: workTaskSliceAction.updateProgressTaskRequest,
  });
};

export const useCopyTask = () => {
  useSuccess(createSuccessSelector);
  useFailed(createFailedSelector, 'Sao chép công việc thất bại');

  return useSubmit({
    loadingSelector: isSubmitLoadingSelector,
    action: workTaskSliceAction.copyTaskRequest
  })
};
export const useDeleteTask = () => {
  useSuccess(deleteSuccessSelector);
  useFailed(deleteFailedSelector);
  return useSubmit({
    loadingSelector: isSubmitLoadingSelector,
    action: workTaskSliceAction.deleteRequest
  })
}
export const useResetComment = () => {
  return useSubmit({
    loadingSelector: () => false,
    action: workTaskSliceAction.resetComment,
  })
};

export const useSearchTask = () => {
  useFailed(getSearchListTaskFailed, 'Tìm kiếm liên kết bị lỗi!');
  return useSubmit({
    loadingSelector: () => false,
    action: workTaskSliceAction.searchTaskRequest,
  })
};

export const useGetRelationTask = (query: any) => {
  return useFetchByParam({
    action: workTaskSliceAction.getRelationTaskRequest,
    loadingSelector: loadingGetTaskRelation,
    dataSelector: listRelation,
    failedSelector: getListTaskRelationFailed,
    param: query
  })
};

export const useUpdateRelationTask = () => {
  return useSubmit({
    loadingSelector: () => false,
    action: workTaskSliceAction.updateRelationTaskRequest,
  })
};

export const useHandleAssign = () => {
  useFailed(assignFailedSelector);
  return useSubmit({
    loadingSelector: isLoadingAssignSelector,
    action: workTaskSliceAction.assignTaskRequest
  })
};

export const TASK_ITEM_API = {
  FETCH: 'FETCH',
  PUSH: 'PUSH',
  EMOTION: 'EMOTION',
  COMMENT: 'COMMENT',
  DELETE_COMMENT: 'DELETE_COMMENT',
};

export const useListenComment= (taskId: any)=>{
  const taskIdmemo =useMemo(()=>taskId,[taskId]);
  const dispatch = useDispatch();
  const data = useSelector(listComment); 
  useEffect(()=>{
    let eventListener : any;
    if(taskIdmemo){
      eventListener = new EventSource(BASE_URL+'/api/v1/process-task-item-listen?taskItemId='+taskIdmemo);

      eventListener.onmessage = function(event: any){
        const parsedData = JSON.parse(event.data);
        switch (parsedData?.case) {
          case TASK_ITEM_API['FETCH']:{
              if(isArray(get(parsedData?.data,'comment',parsedData?.data))){
                dispatch(workTaskSliceAction.commentList(get(parsedData?.data,'comment',parsedData?.data)));
              }
              break;
            }
            case TASK_ITEM_API['PUSH']:{
              dispatch(workTaskSliceAction.commentPush(parsedData?.data));
            break;
          }
          case TASK_ITEM_API['EMOTION']:{
            dispatch(workTaskSliceAction.commentEmotion(parsedData?.data));
            break;
          }
          case TASK_ITEM_API['DELETE_COMMENT']:{
            dispatch(workTaskSliceAction.deleteComment(parsedData?.data));
            break;
          }
          case TASK_ITEM_API['COMMENT']:{
            dispatch(workTaskSliceAction.updateComment(parsedData?.data));
            break;
          }
          default:
            break;
        }
      }

      eventListener.addEventListener('error', (e: any) => {
        eventListener.close();
      });
    }
    return () => {
      if(eventListener){
        eventListener.close();
      }
    };
  }, [taskIdmemo, dispatch])
  return [data]
}

export const useSendComment =()=>{
  return useSubmit({
    loadingSelector:isLoadingComment,
    action :workTaskSliceAction.commentRequest,
  })
}
export const useUpdateEmotionComment = () => {
  return useSubmit({
    loadingSelector: () => false,
    action: workTaskSliceAction.pushEmotionRequest,
  })
};
export const useDeleteComment = () => {
  return useSubmit({
    loadingSelector: () => false,
    action: workTaskSliceAction.deleteCommentRequest,
  })
};
export const useUpdateComment = () => {
  return useSubmit({
    loadingSelector: () => false,
    action: workTaskSliceAction.commentUpdateRequest,
  })
};
export const useResetAction = () => {
  return useResetState(workTaskSliceAction.resetAction);
};
export const useReset = () => {
  return useSubmit({
    loadingSelector: () => false,
    action: workTaskSliceAction.resetAction
  })
}