
import { get, isNil } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { StringToSlug, clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetchByParam,
    useQueryParams,
    useResetState,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { employeeGroupActions } from "./redux/reducer";
const MODULE = "employeeGroup";
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

export const useEmployeeGroupPaging = () => useSelector(pagingSelector);

const getSelectorPolicy = (key : string) => (state:any) => state.policy[key];
const actionsSelector = getSelectorPolicy('actionsEmployee');

export const useGetEmployeeGroups = (param?: any) => {
  return useFetchByParam({
    action: employeeGroupActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetEmployeeGroup = (id: any) => {
  return useFetchByParam({
    action: employeeGroupActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
    actionUpdate : employeeGroupActions.updatePolicyById,
  });
};

export const useCreateEmployeeGroup = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: employeeGroupActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateEmployeeGroup = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: employeeGroupActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteEmployeeGroup = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: employeeGroupActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useEmployeeGroupQueryParams = () => {
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
  }, [page, limit, keyword, createSuccess, deleteSuccess,updateSuccess]);
};

export const useUpdateEmployeeGroupParams = (
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

export const useResourceColumns = (renderPermission: any) => {
  const actions = useSelector(actionsSelector);
  const actionColumns = (actions || [])?.map(({ name, key }: any, index: number) => ({
    title: name,
    dataIndex: 'key',
    key: key,
    width : '13%',
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

export const onSearchPermissions = (keyword: string = '', resource: any[] = [], updateResources: (data: any) => void) => {
  if (isNil(keyword) || keyword === '') return updateResources(resource);
  const resultSearch = resource?.filter(item => {
    return StringToSlug(get(item, 'name', '')?.toLowerCase())?.includes(StringToSlug(keyword?.trim()?.toLowerCase()));
  });
  updateResources(resultSearch);
};

export const useResetEmployeeGroups = () => {
  return useResetState(employeeGroupActions.resetAction);
};

