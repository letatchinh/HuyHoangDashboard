
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelector,
    getSelectors,
    useFailed, useFetchByParam,
    useQueryParams,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { scheduleActions } from "./redux/reducer";
const MODULE = "schedule";
const MODULE_VI = "";

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
const listByCourseIdSelector = getSelector('listByCourseId',MODULE);
const listByCourseIdLoadingSelector = getSelector('listByCourseIdLoading',MODULE);
const getListByCourseIdFailedSelector = getSelector('getListByCourseIdFailed',MODULE);
export const useSchedulePaging = () => useSelector(pagingSelector);

export const useGetSchedules = (param:any) => {
  return useFetchByParam({
    action: scheduleActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};

export const useGetSchedulesByCourseId = (courseId:any) => {
  return useFetchByParam({
    action: scheduleActions.getListByCourseIdRequest,
    loadingSelector: listByCourseIdLoadingSelector,
    dataSelector: listByCourseIdSelector,
    failedSelector: getListByCourseIdFailedSelector,
    param : courseId
  });
};

export const useGetSchedule = (id: any) => {
  return useFetchByParam({
    action: scheduleActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateSchedule = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: scheduleActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateSchedule = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: scheduleActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteSchedule = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: scheduleActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useScheduleQueryParams = () => {
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
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess]);
};

export const useUpdateScheduleParams = (
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
