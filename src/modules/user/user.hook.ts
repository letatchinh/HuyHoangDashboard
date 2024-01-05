import { get, groupBy, last } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp, removeAccents } from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetch,
  useFetchByParam,
  useQueryParams,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { userSliceAction } from "./redux/reducer";
const MODULE  = "user";
const MODULE_VI  = "Người dùng";

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
const getSelector = (key: string) => (state: any) => state.user[key];
const policySelector = getSelector('policy');
const profileSelector = getSelector('profile');

export const useUserPaging = () => useSelector(pagingSelector);

export const useGetUsers = (params: any) => {
  return useFetchByParam({
    action: userSliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param: params,
  });
};

export const useGetUser = (id: any) => {
  return useFetchByParam({
    action: userSliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateUser = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: userSliceAction.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateUser = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: userSliceAction.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteUser = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: userSliceAction.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUserQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");

  const createSuccess = useSelector(createSuccessSelector);

  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess]);
};

export const useUpdateUserParams = (
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
  };
  const newUserName = await adapterValidateUsername(username, callApi)
  return newUserName
};
 
//POLICY
const isMatchPolicy = (policies : any, requiredPermission : any) => {
  return !!requiredPermission?.reduce((policy : any , permission : any )=> {
    return policy?.[permission];
  }, policies);
};


export const useMatchPolicy = (requiredPermission : any) => {
  const policies = useSelector(policySelector);
  const profile = useSelector(profileSelector);

  const isMatch = useMemo(() => {
    if (profile?.isSuperAdmin) {
      return true;
    }
    if (!requiredPermission) return true;

    if (Array.isArray(requiredPermission[0])) {
      return requiredPermission.reduce((isMatch : any , permissionItem : any ) => {
        return isMatch && isMatchPolicy(policies, permissionItem);
      }, true);
    }

    return isMatchPolicy(policies, requiredPermission);
  }, [requiredPermission, policies]);
  return isMatch;
};
