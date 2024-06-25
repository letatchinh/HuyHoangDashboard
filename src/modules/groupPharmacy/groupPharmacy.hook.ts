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
    useResetState,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { groupPharmacyActions } from "./redux/reducer";
import { STATUS } from "~/constants/defaultValue";
const MODULE = "groupPharmacy";
const MODULE_VI = "nhóm khách hàng B2B";

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

export const useGroupPharmacyPaging = () => useSelector(pagingSelector);

export const useGetGroupsPharmacy = (param:any) => {
  return useFetchByParam({
    action: groupPharmacyActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};

export const useGetSearchGroupsPharmacy = (param:any) => {
  return useFetchByParam({
    action: groupPharmacyActions.getListSearchRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
 
export const useGetGroupPharmacy = (id: any) => {
  return useFetchByParam({
    action: groupPharmacyActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateGroupPharmacy = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: groupPharmacyActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateGroupPharmacy = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: groupPharmacyActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteGroupPharmacy = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: groupPharmacyActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useGroupPharmacyQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const status = query.get("status");
  const createSuccess = useSelector(createSuccessSelector);
  const updateSuccess = useSelector(updateSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      status
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, status, createSuccess, updateSuccess, deleteSuccess]);
};

export const useUpdateGroupPharmacyParams = (
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
export const useInitGroupPharmacy = (groupPharmacy: any, id: any) => {
  return useMemo(() => {
    if (!groupPharmacy || !id) {
      return { status: true };
    }

    return {
      ...groupPharmacy,
      status: groupPharmacy.status === STATUS.ACTIVE ? true : false,
    };
  }, [groupPharmacy, id]);
};
export const useResetGroupPharmacyAction = () => {
  useResetState(groupPharmacyActions.resetAction);
};