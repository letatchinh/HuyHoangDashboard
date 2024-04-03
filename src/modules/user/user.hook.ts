import { get, groupBy, last } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp, removeAccents } from "~/utils/helpers";
import { fromJSON } from "./components/parse";
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
import { userSliceAction } from "./redux/reducer";
const MODULE = "user";
const MODULE_VI = "Người dùng";

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

export const useUserPaging = () => useSelector(pagingSelector);
const policySelector = getSelector("policy");
const isGetPolicyLoadingSelector = getSelector("isGetPolicyLoading");
const getPolicyFailedSelector = getSelector("getPolicyFailedSelector");

const profileSelector = getSelector("profile");
const isGetProfileLoadingSelector = getSelector("isGetProfileLoading");
const getProfileFailedSelector = getSelector("getProfileFailed");

const isSubmitProfileLoadingSelector = getSelector(
  "isSubmitUpdateProfileLoading"
);
const updateProfileSuccessSelector = getSelector("updateProfileSuccess");
const updateProfileFailedSelector = getSelector("updateProfileFailed");

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
export const useGetProfileUser = () => {
  return useFetch({
    action: userSliceAction.getProfileRequest,
    loadingSelector: isGetProfileLoadingSelector,
    dataSelector: profileSelector,
    failedSelector: getProfileFailedSelector,
  });
};

export const useUpdateProfile = (callback?: any) => {
  useSuccess(
    updateProfileSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateProfileFailedSelector);

  return useSubmit({
    action: userSliceAction.updateProfileRequest,
    loadingSelector: isSubmitProfileLoadingSelector,
  });
};

export const useInitUserProfile = (profile: any) => {
  return useMemo(() => {
    if (!profile) {
      return {};
    }

    const initValues = {
      ...fromJSON(profile),
    };

    return initValues;
  }, [profile, profile?.user?._id]);
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
  const [limit, setLimit] = useState<any>(query.get("limit") || 10);
  const [page, setPage] = useState<any>(query.get("page") || 1);
  const keyword = query.get("keyword");
  const groupIds = query.get("groupIds") || null;
  const status = query.get("status") || null;

  const createSuccess = useSelector(createSuccessSelector);
  const updateSuccess = useSelector(updateSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  const onTableChange: any = ({ current, pageSize }: any) => {
    setLimit(pageSize);
    setPage(current);
  };

  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      groupIds,
      status,
    };
    return [queryParams, onTableChange];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, groupIds, status, updateSuccess,deleteSuccess]);
};

export const useUpdateUserParams = (query: any, listOptionSearch?: any[]) => {
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

const adapterValidateUsername = async (username: any, callApi: any) => {
  const res = await callApi({
    username: removeAccents(username?.toLowerCase()),
  }); // API Get username
  return get(res, "username", "");
};
export const autoCreateUsername = async ({ fullName, callApi }: any) => {
  const splitFullName = fullName?.trim()?.split(" ");
  let username = last(splitFullName);
  for (let i = 0; i <= splitFullName?.length - 2; i++) {
    const value = get(splitFullName, `${i}.[0]`, "");
    username += value;
  }
  const newUserName = await adapterValidateUsername(username, callApi);
  return newUserName;
};

//POLICY

export const useGetPolicyCheckAllPage = (param?: any): any => {
  return useFetch({
    action: userSliceAction.getPolicyRequest,
    loadingSelector: isGetPolicyLoadingSelector,
    dataSelector: policySelector,
    failedSelector: getPolicyFailedSelector,
    // param: param,
  });
};

export const useResetGroups = () => {
  return useResetState(userSliceAction.resetAction);
};

export const useInitialValues = (user: any) => {
  const data = {
    fullName: user?.email ,
    email: user?.email ,
    gender: user?.email ,
    phoneNumber: user?.email ,
    idNumber: user?.email ,
    userId: user?.adapter?.userId ,
    username: user?.adapter?.username,
    groups: user?.adapter?.groups || [],
    address: user?.address || {},
  };
  return data;
};
