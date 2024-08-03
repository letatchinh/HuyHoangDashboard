// Please UnComment To use

import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetchByParam,
  useQueryParams,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { reportGroupEmployeeSellerActions } from "./redux/reducer";
const MODULE = "reportGroupEmployeeSeller";
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

export const useReportGroupEmployeeSellerPaging = () =>
  useSelector(pagingSelector);

export const useGetReportGroupEmployeeSellers = (param: any) => {
  return useFetchByParam({
    action: reportGroupEmployeeSellerActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param,
  });
};
export const useGetReportGroupEmployeeSellerProduct = (param: any) => {
  return useFetchByParam({
    action: reportGroupEmployeeSellerActions.getListProductRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param,
  });
};

export const useGetGroupSeller = (param: any) => {
  return useFetchByParam({
    action: reportGroupEmployeeSellerActions.getGroupSellerRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param,
  });
};
export const useCreateReportGroupEmployeeSeller = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: reportGroupEmployeeSellerActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateReportGroupEmployeeSeller = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: reportGroupEmployeeSellerActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteReportGroupEmployeeSeller = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: reportGroupEmployeeSellerActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useReportGroupEmployeeSellerQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  // const keyword = query.get("keyword");
  const rangerTime = query.get("rangerTime");
  const rangerType = query.get("rangerType");
  const getByRanger = query.get("getByRanger") || false;
  const salesGroupId = query.get("salesGroupId")??'';
  return useMemo(() => {
    const queryParams = {
      page: Number(page),
      limit: Number(limit),
      rangerTime,
      rangerType,
      getByRanger: Boolean(getByRanger),
      salesGroupId,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, rangerTime, rangerType, getByRanger, salesGroupId]);
};

export const useUpdateReportGroupEmployeeSellerParams = (
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
