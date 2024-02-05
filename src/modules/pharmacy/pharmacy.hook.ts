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
import { cloneInitState } from "./pharmacy.modal";
import { RootState } from "~/redux/store";

const getSelector = (key: keyof cloneInitState) => (state: RootState) =>
  state[MODULE][key];

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

const pharmacyDebtSelector = getSelector("pharmacyDebt");
const getPharmacyDebtFailedSelector = getSelector("getPharmacyDebtFailed");
const isLoadingGetPharmacyDebtSelector = getSelector(
  "isLoadingGetPharmacyDebt"
);
const pagingPharmacyDebtSelector = getSelector("pagingPharmacyDebt");

const historyPharmacySelector = getSelector("historyPharmacy");
const getHistoryPharmacyFailedSelector = getSelector("getHistoryPharmacyFailed");
const isLoadingGetHistoryPharmacySelector = getSelector("isLoadingGetHistoryPharmacy");
const pagingHistoryPharmacySelector = getSelector("pagingPharmacyDebt");

export const useHistoryPharmacyPaging = () => useSelector(pagingHistoryPharmacySelector);

export const useProductSupplierPaging = () => useSelector(pagingPharmacyDebtSelector);

export const usePharmacyPaging = () => useSelector(pagingSelector);

export const useGetPharmacies = (query?: any) => {
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

export const usePharmacyDebtQuery = () => {
  const [limit, setLimit] = useState<number | null | undefined>(10);
  const [page, setPage] = useState<number | null | undefined>(1);
  const [keyword, setKeyword] = useState("");
  const onTableChange: any = ({ current, pageSize }: any) => {
    setPage(current);
    setLimit(pageSize);
  };
  return useMemo(() => {
    const query = {
      page,
      limit,
      keyword,
    };
    return [query, onTableChange];
  }, [page, limit, keyword]);
};

export const useGetPharmacyDebt = (param: any) => {
  return useFetchByParam({
    action: pharmacySliceAction.getPharmacyDebtRequest,
    loadingSelector: isLoadingGetPharmacyDebtSelector,
    dataSelector: pharmacyDebtSelector,
    failedSelector: getPharmacyDebtFailedSelector,
    param,
  });
};

export const useHistoryPharmacyQuery = (keyword?: any) => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const onTableChange : any = ({ current, pageSize }: any) => {
    setPage(current);
    setLimit(pageSize);
  };
  return useMemo(() => {
    const query = {
      page,
      limit,
      keyword,
    };
    return [query,onTableChange];
  }, [page,
     limit,
     keyword,
    ]);
};

export const useGetHistoryPharmacy = (id: any) => {
  console.log('====================================');
  console.log(id, "IDDD");
  console.log('====================================');
  return useFetchByParam({
    action: pharmacySliceAction.getHistoryPharmacyRequest,
    loadingSelector: historyPharmacySelector,
    dataSelector: isLoadingGetHistoryPharmacySelector,
    failedSelector: getHistoryPharmacyFailedSelector,
    param: id,
  });
};

export const useResetPharmacyAction = () => {
  useResetState(pharmacySliceAction.resetAction);
};
