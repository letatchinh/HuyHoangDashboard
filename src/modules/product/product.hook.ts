import { get, omit } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, convertFiles, getExistProp } from "~/utils/helpers";
import {
  getSelectors,
  useAction,
  useFailed,
  useFetchByParam,
  useQueryParams,
  useResetState,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { productActions } from "./redux/reducer";
import dayjs from "dayjs";
import { ColumnsType } from "antd/es/table";

const MODULE = "product";
const MODULE_VI = "";

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

export const useProductPaging = () => useSelector(pagingSelector);

const getSelector = (key: string) => (state: any) => state.product[key];
const listBorrowSelector = getSelector("listBorrow");
const getListBorrowFailedSelector = getSelector("getListBorrowFailed");

const getByIdBorrowSelector = getSelector("byIdBorrow");
const getByIdBorrowFailedSelector = getSelector("getByIdBorrowFailed");

const createBorrowSuccessSelector = getSelector("createBorrowSuccess");
const createBorrowFailedSelector = getSelector("createBorrowFailed");

const updateBorrowSuccessSelector = getSelector("updateBorrowSuccess");
const updateBorrowFailedSelector = getSelector("updateBorrowFailed");

const deleteBorrowSuccessSelector = getSelector("deleteBorrowSuccess");
const deleteBorrowFailedSelector = getSelector("deleteBorrowFailed");

const pagingBorrowSelector = getSelector("pagingBorrow");
export const usePagingBorrow = ()=>  useSelector(pagingBorrowSelector);

export const useGetProducts = (param: any) => {
  return useFetchByParam({
    action: productActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param,
  });
};
export const useGetProduct = (id: any) => {
  return useFetchByParam({
    action: productActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateProduct = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: productActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateProduct = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: productActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteProduct = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: productActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useProductQueryParams = (supplierId?: any) => {
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
      supplierId,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess, supplierId]);
};

export const useUpdateProductParams = (
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
export const useResetAction = () => {
  return useResetState(productActions.resetAction);
};

// export const useChangeVariantDefault = () => {
//   const Dispatch = useDispatch();
//   const onChange = ({
//     productId,
//     variantId,
//   }: {
//     productId: string;
//     variantId: string;
//   }) => {
//     Dispatch(productActions.changeVariantDefault());
//   };
//   return onchange;
// };


export const useChangeVariantDefault = () => {
  return useAction({
    action: productActions.changeVariantDefault,
  });
};
export const useResetActionProductFullState = () => {
  return useResetState(productActions.resetActionFullState);
};

// ----BORROW_PRODUCT------

export const useProductBorrowQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const createSuccess = useSelector(createBorrowSuccessSelector);
  const deleteSuccess = useSelector(deleteBorrowSuccessSelector);
  const startDate = query.get('startDate') || dayjs().startOf('month').format("YYYY-MM-DDTHH:mm:ss");
  const endDate = query.get('endDate') || dayjs().endOf('month').format("YYYY-MM-DDTHH:mm:ss");

  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      startDate,
      endDate,
      // supplierId,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess, startDate, endDate]);
};


export const useGetProductsBorrow = (param: any) => {
  return useFetchByParam({
    action: productActions.getListBorrowRequest,
    loadingSelector: loadingSelector,
    dataSelector: listBorrowSelector,
    failedSelector: getListBorrowFailedSelector,
    param,
  });
};
export const useGetProductBorrow = (id: any) => {
  return useFetchByParam({
    action: productActions.getByIdBorrowRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdBorrowSelector,
    failedSelector: getByIdBorrowFailedSelector,
    param: id,
  });
};

export const useCreateProductBorrow = (callback?: any) => {
  useSuccess(
    createBorrowSuccessSelector,
    `Tạo mới phiếu mượn sản phẩm thành công`,
    callback
  );
  useFailed(createBorrowFailedSelector);

  return useSubmit({
    action: productActions.createBorrowRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateProductBorrow = (callback?: any) => {
  useSuccess(
    updateBorrowSuccessSelector,
    `Cập nhật phiếu mượn sản phẩm thành công`,
    callback
  );
  useFailed(updateBorrowFailedSelector);

  return useSubmit({
    action: productActions.updateBorrowRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteProductBorrow = (callback?: any) => {
  useSuccess(deleteBorrowSuccessSelector, `Xoá phiếu mượn sản phẩm thành công`, callback);
  useFailed(deleteBorrowFailedSelector);

  return useSubmit({
    action: productActions.deleteBorrowRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useConvertProductListCollaborator = (data: any) => {
  return data?.products?.map((item: any) => item?.product);
};

export const useConvertDataAssignProductsCol = (products: any[], selectedRowKey: any[]) => {
  return  products?.filter(product => selectedRowKey?.includes(product?._id));
};

export const SubmitProductsBorrow = (values: any) => {
  return {
    ...omit(values, ["dateRefun"]),
    items: values?.data?.map((item: any) => ({
      productId: item?._id,
      variantId: item?.variantCurrent?._id,
      quantity: item?.quantity,
      priceBefore: item?.variantCurrent?.price,
      note: item?.note || "",
      dateRefun: dayjs(item?.dateRefun).format("YYYY-MM-DD"),
    })),
    files: convertFiles(values?.files?.fileList
    ),
  };
};

export const convertProductsBorrowById = (data: any, products: any[] | undefined) => {
  const items = data?.items?.map((item: any) => item?.productId);
return products?.filter(product => items?.includes(product._id));
};