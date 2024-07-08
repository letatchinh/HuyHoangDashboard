import { get, groupBy } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetch,
  useFetchByParam,
  useQueryParams,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { branchSliceAction } from "./redux/reducer";
import { RootState } from "~/redux/store";
const MODULE = "branch";
const MODULE_VI = "Chi nhánh";

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
const getSelector = (key : string) => (state: any) => state.branch[key];
const isLoadingWarehouse = getSelector('isLoadingWarehouse');
const listWarehouse = getSelector('listWarehouse');
const getListWarehouseFailed = getSelector('getListWarehouseFailed');

const updateApiKeySuccessSelector = getSelector('updateApiKeySuccess');
const updateApiKeyFailedSelector = getSelector('updateApiKeyFailed');

export const useBranchPaging = () => useSelector(pagingSelector);

export const useGetBranches = (params: any) => {
  return useFetchByParam({
    action: branchSliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param: params,
  });
};
export const useGetBranch = (id: any) => {
  return useFetchByParam({
    action: branchSliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateBranch = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: branchSliceAction.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateBranch = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: branchSliceAction.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteBranch = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: branchSliceAction.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};


export const useBranchQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");

  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword]);
};

export const useUpdateBranchParams = (
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


export const useUpdateApiKey = (callback?: any) => {
  useSuccess(
    updateApiKeySuccessSelector,
    `Cập nhật mã liên kết kho thành công`,
    callback
  );
  useFailed(updateApiKeyFailedSelector);
  return useSubmit({
    action: branchSliceAction.updateApiKeyRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useGetListWarehouseInPMS = () => {
  console.log('hook')
  return useFetch({
    action: branchSliceAction.getListWarehouseRequest,
    loadingSelector: isLoadingWarehouse,
    dataSelector: listWarehouse,
    failedSelector: getListWarehouseFailed,
  });
};
