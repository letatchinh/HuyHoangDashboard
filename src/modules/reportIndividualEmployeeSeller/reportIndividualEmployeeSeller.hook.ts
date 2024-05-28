// Please UnComment To use

import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetchByParam,
    useQueryParams,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { reportIndividualEmployeeSellerActions } from "./redux/reducer";
const MODULE = "reportIndividualEmployeeSeller";
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

export const useReportIndividualEmployeeSellerPaging = () => useSelector(pagingSelector);

export const useGetReportIndividualEmployeeSellers = (param:any) => {
  return useFetchByParam({
    action: reportIndividualEmployeeSellerActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetReportIndividualEmployeeSeller = (id: any) => {
  return useFetchByParam({
    action: reportIndividualEmployeeSellerActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateReportIndividualEmployeeSeller = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: reportIndividualEmployeeSellerActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateReportIndividualEmployeeSeller = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: reportIndividualEmployeeSellerActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteReportIndividualEmployeeSeller = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: reportIndividualEmployeeSellerActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useReportIndividualEmployeeSellerQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  // const keyword = query.get("keyword");
  const sellerId = query.get("sellerId");
  const rangerTime = query.get("rangerTime");
  const rangerType = query.get("rangerType");
  const productId = query.get("productId");
  const datatype = query.get("datatype");

  return useMemo(() => {
    const queryParams = {
      page:Number(page),
      limit:Number(limit),
      sellerId,
      rangerTime,
      rangerType,
      productId,
      datatype,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, sellerId, rangerTime, rangerType, productId, datatype]);
};

export const useUpdateReportIndividualEmployeeSellerParams = (
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
