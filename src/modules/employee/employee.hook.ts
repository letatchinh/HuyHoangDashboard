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
  useResetState,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { employeeSliceAction } from "./redux/reducer";
import { useDispatch } from "react-redux";
const MODULE  = "employee";
const MODULE_VI  = "Trình dược viên";
const getSelector = (key: string) => (state: any) => state[MODULE][key];

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
const convertSuccessSelector = getSelector("convertSuccess");
const convertFailedSelector = getSelector("convertFailed");

const getMyEmployeeLoadingSelector = getSelector("isGetMyEmployeeLoading");
const getMyEmployeeSelector = getSelector("myEmployee"); 
const getMyEmployeeFailedSelector = getSelector("getMyEmployeeFailed");
const addProductSuccessSelector = getSelector("addProductSuccess");
const addProductFailedSelector = getSelector("addProductFailed");

const removeProductSuccessSelector = getSelector("removeProductSuccess");
const removeProductFailedSelector = getSelector("removeProductFailed");

const updateProductSuccessSelector = getSelector("updateProductSuccess");
const updateProductFailedSelector = getSelector("updateProductFailed");
export const useEmployeePaging = () => useSelector(pagingSelector);

export const useGetEmployees = (payload: object) => {
  return useFetchByParam({
    action: employeeSliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param: payload
  });
};
export const useGetEmployee = (id: any) => {
  return useFetchByParam({
    action: employeeSliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateEmployee = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: employeeSliceAction.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateEmployee = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: employeeSliceAction.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteEmployee = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: employeeSliceAction.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useConvertEmployee = (callback?: any) => {
  useSuccess(
    convertSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(convertFailedSelector);

  return useSubmit({
    action: employeeSliceAction.convertRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useGetEmployeeId_onlyGet = () => {
  return [useSelector(getByIdSelector), useSelector(getByIdLoadingSelector)];
};

export const useEmployeeQueryParams = (limitDefault? : number) => {
  const query = useQueryParams();
  const limit = query.get("limit") || limitDefault || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const status = query.get("status");

  // const onTableChange: any = ({ current, pageSize }: any) => {
  //   setPage(current);
  //   setLimit(pageSize);
  // };
  
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  const convertSuccess = useSelector(convertSuccessSelector);
  // const data = useSelector(listSelector);

  // const newPage = useMemo(() => {
  //   if (!data?.length && page > 1) {
  //     setPage(page - 1);
  //     return page - 1;  
  //   };
  //   return page;
  // }, [data, page]);
  return useMemo(() => {
    const queryParams = {
      page,     
      limit,
      keyword,
      status,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword,status, createSuccess, deleteSuccess, convertSuccess]);
};

export const useUpdateEmployeeParams = (
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

export const useResetStateEmployee = () => {
  return useResetState(employeeSliceAction.resetAction);
};

export const useGetMyEmployee = (id: any) => {
  return useFetchByParam({
    action: employeeSliceAction.getMyEmployeeRequest,
    loadingSelector: getMyEmployeeLoadingSelector,
    dataSelector: getMyEmployeeSelector,
    failedSelector: getMyEmployeeFailedSelector,
    param: id,
  });
};
export const useAddProductEmployee = (callback?: any) => {
  useSuccess(
    addProductSuccessSelector,
    '',
    callback
  );
  useFailed(addProductFailedSelector);

  return useSubmit({
    action: employeeSliceAction.addProductRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};
export const useRemoveProductEmployee = (callback?: any) => {
  useSuccess(
    removeProductSuccessSelector,
    ``,
    callback
  );
  useFailed(removeProductFailedSelector);

  return useSubmit({
    action: employeeSliceAction.removeProductRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateProductEmployee = (callback?: any) => {
  useSuccess(
    updateProductSuccessSelector,
    '',
    callback
  );
  useFailed(updateProductFailedSelector);

  return useSubmit({
    action: employeeSliceAction.updateProductRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};
