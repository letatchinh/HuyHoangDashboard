import { resetAction } from './../../../.history/src/modules/supplier/supplier.hook_20240307094358';
import { get } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { RootState } from "~/redux/store";
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
import { supplierSliceAction } from "./redux/reducer";
import { PROVIDER_COLLECTION_CONTRACT_MINERAL, cloneInitState } from "./supplier.modal";
import { useDispatch } from "react-redux";
import dayjs from "dayjs";
const MODULE = "supplier";
const MODULE_VI = "Nhà cung cấp";
const getSelector = (key: keyof cloneInitState) => (state: RootState) =>
  state[MODULE][key];

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

const voucherSupplierSelector = getSelector("voucherSupplier");
const getVoucherSupplierFailedSelector = getSelector("getVoucherSupplierFailed");
const isLoadingGetVoucherSupplierSelector = getSelector("isLoadingGetVoucherSupplier");
const pagingVoucherSupplierSelector = getSelector("pagingVoucherSupplier");

const totalAmountBillItemSupplierSelector = getSelector("totalAmountOrder");

export const useTotalAmountBillItem = () => useSelector(totalAmountBillItemSupplierSelector);
export const useSupplierPaging = () => useSelector(pagingSelector);
export const useVoucherSupplierPaging = () =>
  useSelector(pagingVoucherSupplierSelector);

const productSupplierSelector = getSelector("productSupplier");
const getProductSupplierFailedSelector = getSelector(
  "getProductSupplierFailed"
);
const isLoadingGetProductSupplierSelector = getSelector(
  "isLoadingGetProductSupplier"
);
const pagingProductSupplierSelector = getSelector("pagingProductSupplier");

const suppliersProductAuthorSelector = getSelector("suppliersProductAuthor");
const isLoadingGetSuppliersProductAuthorSelector = getSelector(
  "isLoadingGetSuppliersProductAuthor"
);

const getSuppliersProductAuthorFailedSelector = getSelector(
  "getSuppliersProductAuthorFailed"
);
const pagingSuppliersProductAuthorSelector = getSelector("pagingSuppliersProductAuthor");


//Revenue Supplier

const revenueSupplierSelector = getSelector("revenueSupplier");
const getRevenueSupplierFailedSelector = getSelector("getRevenueSupplierFailed");
const isLoadingGetRevenueSupplierSelector = getSelector("isLoadingGetRevenueSupplier");
const pagingRevenueSupplierSelector = getSelector("pagingRevenueSupplier");

const totalRevenueSelector = getSelector("totalRevenue");
const getTotalRevenueFailedSelector = getSelector("getTotalRevenueFailed");
const isLoadingTotalRevenueSelector = getSelector("isLoadingGetTotalRevenue");

const updateRevenueProductSuccessSelector = getSelector("updateRevenueSuccess");
const updateRevenueProductFailedSelector = getSelector("updateRevenueFailed");

const updateTotalRevenueSuccessSelector = getSelector("updateTotalRevenueSuccess");
const updateTotalRevenueFailedSelector = getSelector("updateTotalRevenueFailed");

const createTotalRevenueSuccessSelector = getSelector("createTotalRevenueSuccess");
const createTotalRevenueFailedSelector = getSelector("createTotalRevenueFailed");

const isLoadingRevenue = getSelector("isLoadingSubmitRevenue");

const revenueListTotalSelector = getSelector("revenueListTotal");
const getListTotalRevenueFailedSelector = getSelector("getListTotalRevenueFailed");
const isLoadingGetListTotalRevenueSelector = getSelector("isLoadingGetListTotalRevenue");
const pagingListTotalRevenueSelector = getSelector("pagingListTotalRevenue");

const productGroupsRevenueSelector = getSelector("productGroupRevenue");
const getProductGroupsRevenueFailedSelector = getSelector("getProductGroupsRevenueFailed");
const isLoadingGetProductGroupsRevenueSelector = getSelector("isLoadingGetListProductGroupRevenue");
const pagingProductGroupsRevenueSelector = getSelector("pagingListProductGroupRevenue");

const updateRevenueProductGroupsSuccessSelector = getSelector("updateRevenueProductGroupsSuccess");
const updateRevenueProductGroupsFailedSelector = getSelector("updateRevenueProductGroupsFailed");

const getRevenueId = getSelector("revenueId");
export const useGetRevenueId = () => useSelector(getRevenueId);

export const useListTotalRevenuePaging = () => useSelector(pagingListTotalRevenueSelector);
export const useRevenueSupplierPaging = () => useSelector(pagingRevenueSupplierSelector);
export const useProductsGroupRevenuePaging = () => useSelector(pagingProductGroupsRevenueSelector);

export const useProductSupplierPaging = () =>
  useSelector(pagingProductSupplierSelector);

export const useGetSuppliers = (param: any) => {
  return useFetchByParam({
    action: supplierSliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param,
  });
};
export const useGetSupplier = (id: any) => {
  return useFetchByParam({
    action: supplierSliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useGetSuppliersProductAuthor = (param: any) => {
  return useFetchByParam({
    action: supplierSliceAction.getSuppliersProductAuthorRequest,
    loadingSelector: isLoadingGetSuppliersProductAuthorSelector,
    dataSelector: suppliersProductAuthorSelector,
    failedSelector: getSuppliersProductAuthorFailedSelector,
    param,
  });
};

export const useCreateSupplier = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: supplierSliceAction.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateSupplier = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: supplierSliceAction.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteSupplier = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: supplierSliceAction.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useSupplierQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page,
     limit,
     keyword,
     createSuccess,
     deleteSuccess,
    ]);
};

export const useSuppliersProductAuthorQueryParams = (keyword?:string) => {
  const query = useQueryParams();
  const [limit, setLimit] = useState(get(query, "limit") || 10);
  const [page, setPage] = useState(get(query, "page") || 1);
  const isSupplierMaster = true;

  // const onTableChange: any = ({ current, pageSize }: any) => {
  //   setLimit(pageSize);
  //   setPage(current);
  // };

  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      isSupplierMaster
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page,
     limit,
     keyword,
    ]);
};

export const useUpdateSupplierParams = (
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

//Product
export const useProductSupplierQuery = (keyword?: any) => {
  const [limit, setLimit] = useState<number | null | undefined>(10);
  const [page, setPage] = useState<number | null | undefined>(1);
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
export const useGetProductSuppliers = (param: any) => {
  return useFetchByParam({
    action: supplierSliceAction.getProductSupplierRequest,
    loadingSelector: isLoadingGetProductSupplierSelector,
    dataSelector: productSupplierSelector,
    failedSelector: getProductSupplierFailedSelector,
    param,
  });
};


//Voucher

export const useVoucherSupplierQuery = (keyword?: any) => {
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

export const useGetVoucherSuppliers = (param: any) => {
  return useFetchByParam({
    action: supplierSliceAction.getVoucherSupplierRequest,
    loadingSelector: isLoadingGetVoucherSupplierSelector,
    dataSelector: voucherSupplierSelector,
    failedSelector: getVoucherSupplierFailedSelector,
    param,
  });
};

export const useResetAction = () => {
  return useResetState(supplierSliceAction.resetAction);
};

export const useResetActionInRevenue = () => {
  return useResetState(supplierSliceAction.resetActionInRevenue);
};

export const useResetActionInTotalRevenue = () => {
  return useResetState(supplierSliceAction.resetActionInTotalRevenue);
};


export const useDebtQueryParams = () => {
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
  }, [page,
     limit,
     keyword,
    ]);
};


//Revenue Supplier

export const useRevenueProductQueryParams = (idRevenue?: any) => {
  const query = useQueryParams();
  const { id } = useParams();
  const [page, setPage] = useState<any>(query.get("page") || 1);
  const [limit, setLimit] = useState<any>(query.get("limit") || 10);
  const keyword = query.get("keyword");
  const revenueId = idRevenue ? idRevenue : null;
  const providerCollection =  PROVIDER_COLLECTION_CONTRACT_MINERAL.supplier;

  const onTableChange: any = ({ current, pageSize }: any) => {
    setPage(current);
    setLimit(pageSize);
  };

  const updateSuccess = useSelector(updateTotalRevenueSuccessSelector);
  const updateRevenueProductSuccess = useSelector(updateRevenueProductSuccessSelector);

  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      id,
      revenueId,
      providerCollection,
    };
    return [queryParams, onTableChange];
    //eslint-disable-next-line
  }, [page,
     limit,
      keyword,
      id,
      revenueId,
      updateSuccess,
      updateRevenueProductSuccess,
    ]);
};

export const useListTotalRevenueQueryParams = () => {
  const query = useQueryParams();
  const { id } = useParams();
  const [page, setPage] = useState<any>(query.get("page") || 1);
  const [limit, setLimit] = useState<any>(query.get("limit") || 10);
  const startDate = query.get('startDate') || dayjs().startOf('month').format("YYYY-MM-DDTHH:mm:ss");
  const endDate = query.get('endDate') || dayjs().endOf('month').format("YYYY-MM-DDTHH:mm:ss");
  const providerCollection =  PROVIDER_COLLECTION_CONTRACT_MINERAL.supplier;

  const onTableChange: any = ({ current, pageSize }: any) => {
    setPage(current);
    setLimit(pageSize);
  };
  const keyword = query.get("keyword");
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      id,
      startDate,
      endDate,
      providerCollection
    };
    return [queryParams, onTableChange];
    //eslint-disable-next-line
  }, [page,
     limit,
      keyword,
      id,
      startDate,
      endDate
    ]);
};

export const useProductGroupsRevenueQueryParams = (idRevenue?: any) => {
  const query = useQueryParams();
  const { id } = useParams();
  const [page, setPage] = useState<any>(query.get("page") || 1);
  const [limit, setLimit] = useState<any>(query.get("limit") || 10);
  const keyword = query.get("keyword");
  const providerCollection =  PROVIDER_COLLECTION_CONTRACT_MINERAL.supplier;

  const onTableChange: any = ({ current, pageSize }: any) => {
    setPage(current);
    setLimit(pageSize);
  };

  const updateSuccess = useSelector(updateTotalRevenueSuccessSelector);
  const updateRevenueProductGroupsSuccess = useSelector(updateRevenueProductGroupsSuccessSelector);

  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      id,
      providerCollection,
    };
    return [queryParams, onTableChange];
    //eslint-disable-next-line
  }, [page,
     limit,
      keyword,
      id,
      updateSuccess,
      updateRevenueProductGroupsSuccess,
    ]);
};

export const useUpdateListTotalRevenueParams = (
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

export const useGetRevenueSupplierById = (param: any) => {
  return useFetchByParam({
    action: supplierSliceAction.getRevenueSupplierRequest,
    loadingSelector: isLoadingGetRevenueSupplierSelector,
    dataSelector: revenueSupplierSelector,
    failedSelector: getRevenueSupplierFailedSelector,
    param
  });
};

export const useGetTotalRevenueSupplierById = (param: any) => {
  return useFetchByParam({
    action: supplierSliceAction.getTotalRevenueRequest,
    loadingSelector: isLoadingTotalRevenueSelector,
    dataSelector: totalRevenueSelector,
    failedSelector: getTotalRevenueFailedSelector,
    param
  });
};

export const useUpdateRevenueSupplier = (callback?: any) => {
  useSuccess(
    updateRevenueProductSuccessSelector,
    `Cập nhật doanh số khoán theo sản phẩm thành công`,
    callback
  );
  useFailed(updateRevenueProductFailedSelector);

  return useSubmit({
    action: supplierSliceAction.updateRevenueSupplierRequest,
    loadingSelector: isLoadingRevenue,
  });
};

export const useUpdateTotalRevenueSupplier = (callback?: any) => {
  useSuccess(
    updateTotalRevenueSuccessSelector,
    `Cập nhật doanh số khoán cho nhà cung cấp thành công`,
    callback
  );
  useFailed(updateTotalRevenueFailedSelector);

  return useSubmit({
    action: supplierSliceAction.updateTotalRevenueSupplierRequest,
    loadingSelector: isLoadingRevenue,
  });
};

export const useCreateTotalRevenue = (callback?: any) => {
  useSuccess(
    createTotalRevenueSuccessSelector,
    `Tạo mới doanh số khoán thành công`,
    callback
  );
  useFailed(createTotalRevenueFailedSelector);

  return useSubmit({
    action: supplierSliceAction.createTotalRevenueRequest,
    loadingSelector: isLoadingRevenue,
  });
};

export const useUpdateRevenueProductGroups = (callback?: any) => {
  useSuccess(
    updateRevenueProductGroupsSuccessSelector,
    `Cập nhật doanh số khoán theo nhóm sản phẩm thành công`,
    callback
  );
  useFailed(updateRevenueProductGroupsFailedSelector);

  return useSubmit({
    action: supplierSliceAction.updateRevenueProductGroupsRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useGetListTotalRevenue = (param: any) => {
  return useFetchByParam({
    action: supplierSliceAction.getListTotalRevenueRequest,
    loadingSelector: isLoadingGetListTotalRevenueSelector,
    dataSelector: revenueListTotalSelector,
    failedSelector: getListTotalRevenueFailedSelector,
    param
  });
};
export const useGetProductsGroupRevenue = (param: any) => {
  return useFetchByParam({
    action: supplierSliceAction.getProductGroupsRevenueRequest,
    loadingSelector: isLoadingGetProductGroupsRevenueSelector,
    dataSelector: productGroupsRevenueSelector,
    failedSelector: getProductGroupsRevenueFailedSelector,
    param
  });
};

export const useResetInRevenueActionUpdate = () => {
  const dispatch = useDispatch();
  const resetAction = useCallback(() => {
    return dispatch(supplierSliceAction.resetActionInTotalRevenue());
  }, [dispatch]);

  return resetAction;
};
