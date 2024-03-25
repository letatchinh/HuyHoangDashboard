import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
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
import { cloneInitState } from "./supplier.modal";
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
