import { get, groupBy, isNil, last } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { StringToSlug, clearQuerySearch, getExistProp, removeAccents } from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetch,
  useFetchByParam,
  useQueryParams,
  useResetState,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { userGroupSliceAction } from "./redux/reducer";
import { useDispatch } from "react-redux";
import { policySliceAction } from "../policy/redux/reducer";
const MODULE  = "userGroup";
const MODULE_VI  = "Nhân viên";

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
 const getSelector = (key : string) => (state:any) => state[MODULE][key];
 const getSelectorPolicy = (key : string) => (state:any) => state.policy[key];
const actionsSelector = getSelectorPolicy('actions');

export const useUserGroupPaging = () => useSelector(pagingSelector);

export const useGetUserGroups = (payload: object) => {
  const createSuccess = useSelector(createSuccessSelector);
  // const updateSuccess = useSelector(updateSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);

  const memoParam : object = useMemo(() => {
    return { ...payload };
    //eslint-disable-next-line
  }, [createSuccess, deleteSuccess, payload]);
  return useFetch({
    action: userGroupSliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    payload: memoParam,
  });
};
export const useGetUserGroup = (params: any) => {
  return useFetchByParam({
    action: userGroupSliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: params,
    actionUpdate : userGroupSliceAction.updatePolicyById,
  });
};


export const useCreateUserGroup = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  // useFailed(createFailedSelector);

  return useSubmit({
    action: userGroupSliceAction.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateUserGroup = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  // useFailed(updateFailedSelector);

  return useSubmit({
    action: userGroupSliceAction.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteUserGroup = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  // useFailed(deleteFailedSelector);

  return useSubmit({
    action: userGroupSliceAction.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUserGroupQueryParams = () => {
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

export const useUpdateUserGroupParams = (
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

const adapterValidateUsername = async (username: any, callApi: any) => {
  const res = await callApi({ username: removeAccents(username?.toLowerCase()) }) // API Get username
  return get(res, 'username', '')
};
export const autoCreateUsername = async ({ fullName, callApi }: any) => {
  const splitFullName = fullName?.trim()?.split(' ')
  let username = last(splitFullName)
  for (let i = 0; i <= splitFullName?.length - 2; i++) {
    const value = get(splitFullName, `${i}.[0]`, '')
    username += value
  }
  const newUserName = await adapterValidateUsername(username, callApi)
  return newUserName
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
  console.log(keyword, resource)
  if (isNil(keyword) || keyword === '') return updateResources(resource);
  const resultSearch = resource?.filter(item => {
    return StringToSlug(get(item, 'name', '')?.toLowerCase())?.includes(StringToSlug(keyword?.trim()?.toLowerCase()));
  });
  updateResources(resultSearch);
};

export const useResetUserGroups = () => {
  return useResetState(userGroupSliceAction.resetAction);
};

