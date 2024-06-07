
import { get, omit } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetchByParam,
    useQueryParams,
    useResetState,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { logisticActions } from "./redux/reducer";
const MODULE = "logistic";
const MODULE_VI = "đơn vị vận chuyển";

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
const getSelector = (key: string) => (state: any) => state.logistic[key];
export const useLogisticPaging = () => useSelector(pagingSelector);
export const useGetFee = () => useSelector(getSelector("fee"));

export const useGetLogistics = (param:any) => {
  return useFetchByParam({
    action: logisticActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetLogistic = (id: any) => {
  return useFetchByParam({
    action: logisticActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateLogistic = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: logisticActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateLogistic = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: logisticActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteLogistic = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: logisticActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useLogisticQueryParams = () => {
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

export const useUpdateLogisticParams = (
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

export const useCountFee = () => {
  return useSubmit({
    action: logisticActions.countFeeRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useResetLogisticAction = () => {
  return useResetState(logisticActions.resetAction);
};
export const SubmitCountLogisticFee = (data: any, props?: any) => {
  return {
    ...omit(data, ['customerAddress', 'code', 'totalFee']),
    ...props
  };
};
