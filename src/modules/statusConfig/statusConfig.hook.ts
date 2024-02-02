
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "~/redux/store";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
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
import { statusConfigActions } from "./redux/reducer";
import { cloneInitState } from "./statusConfig.modal";

const MODULE = "statusConfig";
const MODULE_VI = "Cấu hình trạng thái";
// const getSelector =(  key: keyof RootState) => (state: RootState) => state[MODULE][key];
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

const getSelector = (key: keyof cloneInitState) => (state: RootState) =>
  state[MODULE][key];
  const statusConfigSelector = getSelector("statusConfig");
const getStatusConfigFailedSelector = getSelector(
  "getStatusConfigFailed"
);
const isLoadingGetStatusConfigSelector = getSelector(
  "isLoadingGetStatusConfig"
);
export const useStatusConfigQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  const updateSuccess = useSelector(updateSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page,
     limit,
     keyword,
     createSuccess,
     deleteSuccess,
     updateSuccess
    ]);
};
export const useGetPaging = () => useSelector(pagingSelector);
export const useUpdateStatusConfigParams = (
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
    }

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
export const useStatusConfigPaging = () => useSelector(pagingSelector);
export const useGetListStatusConfig = (query: any) => {
  return useFetchByParam({
    action: statusConfigActions.getStatusConfigRequest,
    dataSelector: statusConfigSelector,
    failedSelector: getStatusConfigFailedSelector,
    loadingSelector: isLoadingGetStatusConfigSelector,
    param: query,
  });
}
export const useCreateStatusConfig = (callBack?: any) => {
  useSuccess(createSuccessSelector, `Tạo ${MODULE_VI} thành công`,callBack);
  useFailed(createFailedSelector);
  return useSubmit({
    action: statusConfigActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  })
}
export const useUpdateStatusConfig = (callBack?: any) => {
  useSuccess(updateSuccessSelector, `Cập nhật ${MODULE_VI} thành công`,callBack);
  useFailed(updateFailedSelector);
  return useSubmit({
    action: statusConfigActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  })
}
export const useDeleteStatusConfig = (callBack?: any) => {
  useSuccess(deleteSuccessSelector, `Xóa ${MODULE_VI} thành công`,callBack);
  useFailed(deleteFailedSelector);
  return useSubmit({
    action: statusConfigActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  })
}

export const useResetAction = () => {
    return useResetState(statusConfigActions.resetAction);
  };