// Please UnComment To use

import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { RootState } from "~/redux/store";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetchByParam,
    useQueryParams,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { cloneInitState, quotationActions } from "./redux/reducer";
const MODULE = "quotation";
const MODULE_VI = "Đơn hàng tạm";
const getSelector = (key: keyof cloneInitState) => (state: RootState) =>
  state[MODULE][key];
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
const convertSuccessSelector = getSelector("convertSuccess");
const convertFailedSelector = getSelector("convertFailed");

export const useQuotationPaging = () => useSelector(pagingSelector);

export const useGetQuotations = (param:any) => {
  return useFetchByParam({
    action: quotationActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetQuotation = (id: any) => {
  return useFetchByParam({
    action: quotationActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateQuotation = (callbackSubmit?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: quotationActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
    callbackSubmit,
  });
};

export const useUpdateQuotation = (callbackSubmit?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: quotationActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
    callbackSubmit,
  });
};

export const useConvertQuotation = (callbackSubmit?: any) => {
  useSuccess(
    convertSuccessSelector,
    `Chuyển đổi ${MODULE_VI} thành công`,
  );
  useFailed(convertFailedSelector);

  return useSubmit({
    action: quotationActions.convertRequest,
    loadingSelector: isSubmitLoadingSelector,
    callbackSubmit,
  });
};

export const useDeleteQuotation = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: quotationActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};



export const useQuotationQueryParams = (status? : string) => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const pharmacyId = query.get("pharmacyId");
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      status,
      pharmacyId,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess,status,pharmacyId]);
};

export const useUpdateQuotationParams = (
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
