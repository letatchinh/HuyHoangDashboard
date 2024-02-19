
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useAction,
    useFailed, useFetchByParam,
    useQueryParams,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { productsAllSliceAction } from "./redux/reducer";
const MODULE = "productsAll";
const MODULE_VI = "sản phẩm";

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
const getSelector = (key: string) => (state: any) => state.productsAll[key];
const getSelectorProduct = (key: any) => (state: any) => state.product[key];
const createProductSuccessSelector = getSelectorProduct('createSuccess');
const deleteProductSuccessSelector = getSelectorProduct('deleteSuccess');
const getSupplierInfo = getSelector('supplierInfo');
export const useSupplierInfoRedux = () => useSelector(getSupplierInfo);

export const useProductsAllPaging = () => useSelector(pagingSelector);

export const useGetProductsAll = (query: any) => {
  return useFetchByParam({
    action: productsAllSliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param: query,
  });
};
// export const useGetProductAllById = (query: any) => {
//   return useFetchByParam({
//     action: productsAllSliceAction.getByIdRequest,
//     loadingSelector: getByIdLoadingSelector,
//     dataSelector: getByIdSelector,
//     failedSelector: getByIdFailedSelector,
//     param: query,
//   });
// };

// export const useCreateProductsAll = (callback?: any) => {
//   useSuccess(
//     createSuccessSelector,
//     `Tạo mới ${MODULE_VI} thành công`,
//     callback
//   );
//   useFailed(createFailedSelector);

//   return useSubmit({
//     action: productsAllSliceAction.createRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

// export const useUpdateProductsAll = (callback?: any) => {
//   useSuccess(
//     updateSuccessSelector,
//     `Cập nhật ${MODULE_VI} thành công`,
//     callback
//   );
//   useFailed(updateFailedSelector);

//   return useSubmit({
//     action: productsAllSliceAction.updateRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

export const useDeleteProductsAll = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: productsAllSliceAction.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useProductsAllQueryParams = () => {
  const query = useQueryParams();
  const [limit, setLimit] = useState(get(query, "limit") || 10);
  const [page, setPage] = useState(get(query, "page") || 1);
  const isSupplierMaster = true;
  const keyword = query.get("keyword");
  const createSuccess = useSelector(createProductSuccessSelector);
  const deleteSuccess = useSelector(deleteProductSuccessSelector);
  

  const onTableChange: any = ({ current, pageSize }: any) => {
    setLimit(pageSize);
    setPage(current);
  };
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      isSupplierMaster
    };
    return [queryParams, onTableChange];
    //eslint-disable-next-line
  }, [page, limit, keyword,createSuccess, deleteSuccess ]);
};

export const useUpdateProductsAllParams = (
  query: any,
  listOptionSearch?: any[],
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

export const useChangeVariantDefault = () => {
  return useAction({
    action: productsAllSliceAction.changeVariantDefault,
  });
};
export const useSetSupplierInfo = () => {
  return useAction({
    action: productsAllSliceAction.setSupplierInfo,
  });
};
