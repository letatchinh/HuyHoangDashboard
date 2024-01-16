


import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetch, useFetchByParam,
    useQueryParams,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { workListActions } from "./redux/reducer";
import { get } from "lodash";
import { cloneInitState } from "./workList.modal";
import { RootState } from "~/redux/store";
const MODULE = "workList";
const MODULE_VI = "";
const getSelector = (key: keyof cloneInitState) => (state: RootState) =>
  state[MODULE][key];
  const listWorkConfig = getSelector('listWorkConfig');
  const loadingListWorkConfig = getSelector('isLoadingListWorkConfig');
  const getListWorkConfigFailed = getSelector('getListWorkConfigFailed');
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

export const useWorkListPaging = () => useSelector(pagingSelector);

export const useGetWorkLists = (query?:any) => {
  return useFetchByParam({
    action: workListActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param:query
  });
};
export const useGetWorkList = (id: any) => {
  return useFetchByParam({
    action: workListActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};
export const useGetListBoardConfig = (query?:any) => {
  return useFetchByParam({
    action: workListActions.getListBoardConfigRequest,
    loadingSelector: loadingListWorkConfig,
    dataSelector: listWorkConfig,
    failedSelector: getListWorkConfigFailed,
    param:query
  });
}

export const useCreateWorkList = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: workListActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateWorkList = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: workListActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteWorkList = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: workListActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useWorkListQueryParams = (sprintId?: any) => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      sprintId
    };
    return [queryParams];

  }, [page, limit,sprintId, keyword, createSuccess, deleteSuccess]);
};

export const useUpdateWorkListParams = (
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

    clearQuerySearch(listOptionSearch, query, param);

    if (!param.page) {
      query.page = 1;
    };


    const searchString = new URLSearchParams(
      getExistProp({
        ...query,
        ...param,
      })
    ).toString();

    navigate(`${pathname}?${searchString}`);
  };

  return [keyword, { setKeyword, onParamChange }];
};
