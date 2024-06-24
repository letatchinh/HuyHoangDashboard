import { useSelector } from "react-redux";
import {
  getSelectors,
  useFailed,
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
const MODULE_VI = "khách hàng B2B";

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
const pagingHistoryPharmacySelector = getSelector("pagingHistoryPharmacy");

const accumulationSelector = getSelector("accumulation");
const getAccumulationFailedSelector = getSelector("getAccumulationFailed");
const isLoadingGetAccumulationSelector = getSelector("isLoadingGetAccumulation");
const pagingAccumulationSelector = getSelector("pagingAccumulation");

const accumulationDetailSelector = getSelector("accumulationDetail");
const getAccumulationDetailFailedSelector = getSelector("getAccumulationDetailFailed");
const isLoadingGetAccumulationDetailSelector = getSelector("isLoadingGetAccumulationDetail");
const pagingAccumulationDetailSelector = getSelector("pagingAccumulationDetail");

const convertSuccessSelector = getSelector("convertSuccess");
const convertFailedSelector = getSelector("convertFailed");

export const useHistoryPharmacyPaging = () => useSelector(pagingHistoryPharmacySelector);

export const useProductSupplierPaging = () => useSelector(pagingPharmacyDebtSelector);

export const usePharmacyPaging = () => useSelector(pagingSelector);

export const useAccumulationPaging = () => useSelector(pagingAccumulationSelector);

export const useAccumulationDetailPaging = () => useSelector(pagingAccumulationDetailSelector);

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

export const useConvertPharmacy = (callback?: any) => {
  useSuccess(
    convertSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(convertFailedSelector);

  return useSubmit({
    action: pharmacySliceAction.convertRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const usePharmacyQueryParams = (module?: boolean) => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const status = query.get("status");
  const processStatus = query.get("processStatus");
  const approved = module ?? query.get("approved");
  const salesChannel = query.get("salesChannel");
  
  const createSuccess = useSelector(createSuccessSelector);
  const updateSuccess = useSelector(updateSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      status,
      approved,
      processStatus,
      salesChannel,
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
    approved,
    processStatus,
    salesChannel,
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
  // const [keyword, setKeyword] = useState("");
  const onTableChange: any = ({ current, pageSize }: any) => {
    setPage(current);
    setLimit(pageSize);
  };
  return useMemo(() => {
    const query = {
      page,
      limit,
      // keyword,
    };
    return [query, onTableChange];
  }, [page, limit]);
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

export const useHistoryPharmacyQuery = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
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
  
  return useFetchByParam({
    action: pharmacySliceAction.getHistoryPharmacyRequest,
    loadingSelector: isLoadingGetHistoryPharmacySelector,
    dataSelector: historyPharmacySelector,
    failedSelector: getHistoryPharmacyFailedSelector,
    param: id,
  });
};

export const useAccumulationQuery = () => {
  const query = useQueryParams();
  const [limit, setLimit] = useState<number | null | undefined>(10);
  const [page, setPage] = useState<number | null | undefined>(1);
  const keyword = query.get("keyword");
  const productGroupId= query.get("productGroupId")
  // const [keyword, setKeyword] = useState("");
  const onTableChange: any = ({ current, pageSize }: any) => {
    setPage(current);
    setLimit(pageSize);

  };
  return useMemo(() => {
    const query = {
      page,
      limit,
      keyword,
      productGroupId,
    };
    return [query, onTableChange];
  }, [page, limit, keyword, productGroupId]);
};

export const useUpdateAccumulationParams = (
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

export const useGetAccumulation = (param: any) => {
  return useFetchByParam({
    action: pharmacySliceAction.getAccumulationRequest,
    loadingSelector: isLoadingGetAccumulationSelector,
    dataSelector: accumulationSelector,
    failedSelector: getAccumulationFailedSelector,
    param,
  });
};

export const useAccumulationDetailQuery = () => {
  const [limit, setLimit] = useState(10);
  const [page, setPage] = useState(1);
  const [keyword, setKeyword] = useState("");
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

export const useGetAccumulationDetail = (id: any, params: any) => {
  const memoParams = useMemo(() => ({ id, ...params }),[id, params]);
  
  return useFetchByParam({
    action: pharmacySliceAction.getAccumulationDetailRequest,
    loadingSelector: isLoadingGetAccumulationDetailSelector,
    dataSelector: accumulationDetailSelector,
    failedSelector: getAccumulationDetailFailedSelector,
    param: memoParams,
  });
};

export const useResetPharmacyAction = () => {
  useResetState(pharmacySliceAction.resetAction);
};


