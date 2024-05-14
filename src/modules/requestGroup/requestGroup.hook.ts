
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
import { requestGroupActions } from "./redux/reducer";
const MODULE = "requestGroup";
const MODULE_VI = "";
const getSelector = (key : any) => (state : any) => state.requestGroup[key];

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

const loadingByPartnerSelector = getSelector('loadingByPartner');
const pagingRequestOfPartnerSelector = getSelector('pagingRequestOfPartner');
const listRequestOfPartnerSelector = getSelector('listRequestOfPartner');
const getListRequestOfPartnerFailedSelector = getSelector('getListRequestOfPartnerFailed');
const changeStatusFailedSelector = getSelector('changeStatusFailed');
const changeStatusSuccessSelector = getSelector('changeStatusSuccess');

export const useRequestGroupPaging = () => useSelector(pagingSelector);
export const useRequestOfPartnerPaging = () => useSelector(pagingRequestOfPartnerSelector);

export const useGetRequestGroups = (param:any) => {
  return useFetchByParam({
    action: requestGroupActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetRequestGroupOfPartner = (param: any) => {
  return useFetchByParam({
    action: requestGroupActions.getListRequestOfPartnerRequest,
    loadingSelector: loadingByPartnerSelector,
    dataSelector: listRequestOfPartnerSelector,
    failedSelector: getListRequestOfPartnerFailedSelector,
    param,
  });
};

export const useCreateRequestGroup = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: requestGroupActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateRequestGroup = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: requestGroupActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteRequestGroup = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: requestGroupActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useChangeStatus = (callback?: any) => {
  useSuccess(changeStatusSuccessSelector, `thành công`, callback);
  useFailed(changeStatusFailedSelector);

  return useSubmit({
    action: requestGroupActions.changeStatusRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
}

export const useRequestGroupQueryParams = () => {
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

export const useUpdateRequestGroupParams = (
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

export const useResetAction = () => {
    return useResetState(requestGroupActions.resetAction);
  };