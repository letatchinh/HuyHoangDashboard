// Please UnComment To use

import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetchByParam,
  useQueryParams,
  useResetState,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { typePharmacyActions } from "./redux/reducer";
import { STATUS } from "~/constants/defaultValue";
const MODULE = "typePharmacy";
const MODULE_VI = "loại nhà thuốc";

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

export const useTypePharmacyPaging = () => useSelector(pagingSelector);

export const useGetTypePharmacies = (param: any) => {
  return useFetchByParam({
    action: typePharmacyActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param,
  });
};
export const useGetTypePharmacy = (id: any) => {
  return useFetchByParam({
    action: typePharmacyActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateTypePharmacy = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: typePharmacyActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateTypePharmacy = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: typePharmacyActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteTypePharmacy = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: typePharmacyActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useTypePharmacyQueryParams = () => {
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
  }, [
    page,
    limit,
    keyword,
    status,
    createSuccess,
    updateSuccess,
    deleteSuccess,
  ]);
};

export const useUpdateTypePharmacyParams = (
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

export const useInitTypePharmacy = (typePharmacy: any, id: any) => {
  return useMemo(() => {
    if (!typePharmacy || !id) {
      return { status: true };
    }

    return {
      ...typePharmacy,
      status: typePharmacy.status === STATUS.ACTIVE ? true : false,
    };
  }, [typePharmacy, id]);
};

export const useResetTypePharmacyAction = () => {
  useResetState(typePharmacyActions.resetAction);
};
