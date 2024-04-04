
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetch, useFetchByParam,
    useQueryParams,
    useResetState,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { SalesGroupType } from "./salesGroup.modal";
import { salesGroupActions } from "./redux/reducer";
const MODULE = "salesGroup";
const MODULE_VI = "";
const getSelector = (key : any) => (state : any) => state[MODULE][key];

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
  listSearchSelector,
} = getSelectors(MODULE);
const listTeamLeadSelector = getSelector('listTeamLead');
const isLoadingGetListTeamLeadSelector = getSelector('isLoadingGetListTeamLead');
const getListTeamLeadFailedSelector = getSelector('getListTeamLeadFailed');

const listMemberSelector = getSelector('listMember');
const isLoadingGetListMemberSelector = getSelector('isLoadingGetListMember');
const getListMemberFailedSelector = getSelector('getListMemberFailed');

const groupHaveLeaderSelector = getSelector('groupHaveLeader');

export const useSalesGroupPaging = () => useSelector(pagingSelector);

export const useGetSalesGroups = (param:any) => {
  return useFetchByParam({
    action: salesGroupActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    actionUpdate : salesGroupActions.onSearch,
    param
  });
};
export const useGetSalesGroupsSearch  = (): SalesGroupType[] => useSelector(listSearchSelector);
export const useGetGroupHaveLeader  = (): any[] => useSelector(groupHaveLeaderSelector);
export const useGetSalesGroup = (id: any) => {
  return useFetchByParam({
    action: salesGroupActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateSalesGroup = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: salesGroupActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateSalesGroup = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: salesGroupActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteSalesGroup = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: salesGroupActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useSalesGroupQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const createSuccess : any = useSelector(createSuccessSelector);
  const updateSuccess = useSelector(updateSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess,updateSuccess]);
};

export const useUpdateSalesGroupParams = (
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
    return useResetState(salesGroupActions.resetAction);
  };

  export const useGetListTeamLeadSalesGroups = (param?:any) => {
    return useFetchByParam({
      action: salesGroupActions.getListTeamLeadRequest,
      loadingSelector: isLoadingGetListTeamLeadSelector,
      dataSelector: listTeamLeadSelector,
      failedSelector: getListTeamLeadFailedSelector,
      param
    });
  };

  export const useGetListMemberSalesGroups = (param?:any) : any => {
    return useFetchByParam({
      action: salesGroupActions.getListMemberRequest,
      loadingSelector: isLoadingGetListMemberSelector,
      dataSelector: listMemberSelector,
      failedSelector: getListMemberFailedSelector,
      param
    });
  };