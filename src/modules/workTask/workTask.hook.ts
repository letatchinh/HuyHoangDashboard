import { get, groupBy, isString, last } from "lodash";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp, removeAccents } from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetch,
  useFetchByParam,
  useQueryParams,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { useDispatch } from "react-redux";
import { DEFAULT_BRANCH_ID } from "~/constants/defaultValue";
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
  useFailed(updateFailedSelector, 'Cập nhật này việc thất baị');
  return useSubmit({
    loadingSelector: isSubmitLoadingSelector,
    action: workTaskSliceAction.updateRequest,
  })
};


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

export const useUpdateRelationTask =()=>{
  return useSubmit({
    loadingSelector:()=> false,
    action : workTaskSliceAction.updateRelationTaskRequest,
  })
}

