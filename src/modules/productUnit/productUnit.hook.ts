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
import { productUnitActions } from "./redux/reducer";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get, identity } from "lodash";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import { useSelector } from "react-redux";
const MODULE = "productUnit";
const MODULE_VI = "Đơn vị tính";
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
  const isGetAllLoadingSelector = getSelector('isGetAllLoading');
  const unitAllSelector = getSelector('unitAll');
  const getUnitAllFailedSelector = getSelector('getUnitAllFailed');

  export const useProductUnitQueryParams = () => {
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
    }, [page, limit,status, keyword, createSuccess,updateSuccess, deleteSuccess]);
  };
  
  export const useUpdateProductUnitParams = (
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
  export const useGetlistProductUnit = (query?: any) => {
      return useFetchByParam({
        action: productUnitActions.getListRequest,
        loadingSelector: loadingSelector,
        dataSelector: listSelector,
        failedSelector: getListFailedSelector,
        param: query,
      })
  }
  export const useGetlistProductUnitById = (id: string) => {
    console.log(id)
    return useFetchByParam({
      action: productUnitActions.getByIdRequest,
      loadingSelector: getByIdLoadingSelector,
      dataSelector: getByIdSelector,
      failedSelector: getByIdFailedSelector,
      param: id,
    });
  };
  export const useCreateProductUnit = (callBack?:any) => {
    useSuccess(createSuccessSelector, `Thêm ${MODULE_VI} thành công`, callBack);
    useFailed(createFailedSelector);
    return useSubmit({
        action: productUnitActions.createRequest,
        loadingSelector: isSubmitLoadingSelector,
    })
  }
  export const useUpdateProductUnit = (callBack?:any) => {
    useSuccess(updateSuccessSelector, `Cập nhật ${MODULE_VI} thành công`, callBack);
    useFailed(updateFailedSelector);
    return useSubmit({
        action: productUnitActions.updateRequest,
        loadingSelector: isSubmitLoadingSelector,

    })
  }
 export const useDeleteProductUnit =(callBack?:any)=>{
    useSuccess(deleteSuccessSelector, `Xóa ${MODULE_VI} thành công`, callBack);
    useFailed(deleteFailedSelector);
    return useSubmit({ 
        action: productUnitActions.deleteRequest,
        loadingSelector: isSubmitLoadingSelector,
    })
  }
  export const useProductUnitPaging = () => useSelector(pagingSelector);
  export const useResetAction = () => {
    return useResetState(productUnitActions.resetAction);
  };

  export const useGetListProductUnitAll = (reFetch? : boolean) => {
    return useFetch({
      action: productUnitActions.getUnitAllRequest,
      loadingSelector: isGetAllLoadingSelector,
      dataSelector: unitAllSelector,
      failedSelector: getUnitAllFailedSelector,
      payload : reFetch
    })
}