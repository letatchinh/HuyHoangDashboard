import { useSelector } from "react-redux";
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
import { pharmacySliceAction } from "./redux/reducer";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { get } from "lodash";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import { STATUS } from "~/constants/defaultValue";

const MODULE = "pharmacy";
const MODULE_VI = "nhà thuốc";

const {
  loadingSelector,
  listSelector,
  getListFailedSelector,
  getByIdSelector,
  getByIdLoadingSelector,
  getByIdFailedSelector,
  createSuccessSelector,
  createFailedSelector,
  updateSuccessSelector,
  updateFailedSelector,
  deleteSuccessSelector,
  deleteFailedSelector,
  isSubmitLoadingSelector,
  pagingSelector,
} = getSelectors(MODULE);

export const usePharmacyPaging = () => useSelector(pagingSelector);

export const useGetPharmacies = (query? : any) => {
  return useFetchByParam({
    action: pharmacySliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param: query,
  });
};

export const useGetPharmacyId = (id: any) => {
  return useFetchByParam({
    action: pharmacySliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreatePharmacy = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: pharmacySliceAction.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdatePharmacy = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: pharmacySliceAction.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeletePharmacy = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xóa ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: pharmacySliceAction.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const usePharmacyQueryParams = () => {
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
      status,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, status, createSuccess, updateSuccess, deleteSuccess]);
};

export const useUpdatePharmacyParams = (
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
    clearQuerySearch(listOptionSearch, query, param);
    if (!param.page) {
      query.page = 1;
    }
    const searchString = new URLSearchParams(
      getExistProp({
        ...query,
        ...param,
      })
    ).toString();

    navigate(`${pathname}?${searchString}`);
  };

  return [keyword, { setKeyword, onParamChange }];
};

export const useInitPharmacy = (pharmacy: any, id: any) => {
  return useMemo(() => {
    if (!pharmacy || !id) {
      return { status: true };
    }

    return {
      ...pharmacy,
      status: pharmacy.status === STATUS.ACTIVE ? true : false,
    };
  }, [pharmacy, id]);
};

export const useResetPharmacyAction = () => {
  useResetState(pharmacySliceAction.resetAction);
};
