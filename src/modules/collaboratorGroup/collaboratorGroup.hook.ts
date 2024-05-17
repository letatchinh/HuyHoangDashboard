
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
import { collaboratorGroupActions } from "./redux/reducer";
const MODULE = "collaboratorGroup";
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

export const useCollaboratorGroupPaging = () => useSelector(pagingSelector);
const getSelectorPolicy = (key : string) => (state:any) => state.policy[key];
const actionsSelector = getSelectorPolicy('actionsCollaborator');

export const useGetCollaboratorGroups = (param:any) => {
  return useFetchByParam({
    action: collaboratorGroupActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetCollaboratorGroup = (id: any) => {
  return useFetchByParam({
    action: collaboratorGroupActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
    actionUpdate : collaboratorGroupActions.updatePolicyById,
  });
};

export const useCreateCollaboratorGroup = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: collaboratorGroupActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateCollaboratorGroup = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: collaboratorGroupActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteCollaboratorGroup = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: collaboratorGroupActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useCollaboratorGroupQueryParams = (branchIdParam: any) => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const branchId = branchIdParam || query.get("branchId");
  const createSuccess = useSelector(createSuccessSelector);
  const updateSuccess = useSelector(updateSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      branchId
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess,branchId]);
};

export const useUpdateCollaboratorGroupParams = (
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

export const useResetCollaboratorGroups = () => {
  return useResetState(collaboratorGroupActions.resetAction);
};

export const useResourceColumns = (renderPermission: any) => {
  const actions = useSelector(actionsSelector);
  const actionColumns = (actions || [])?.map(({ name, key }: any, index: number) => ({
    title: name,
    dataIndex: 'key',
    key: key,
    width : '10%',
    align: 'center',
    render: renderPermission(key)
  }));
  return [
    {
      title: 'Chức năng',
      dataIndex: 'name',
      key: 'resource',
      width : 'auto',
    },
    ...actionColumns
  ];
};
interface Resource {
  resource: {
    name?: string;
    key?: string
  };
}