import { 
    getSelectors,
    useFailed,
    useFetch,
    useFetchByParam,
    useQueryParams,
    useSubmit,
    useSuccess,
 } from "~/utils/hook";
import { productConfigSliceAction } from "./redux/reducer";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get, identity } from "lodash";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import { useSelector } from "react-redux";
const MODULE = "productConfig";
const MODULE_VI = "Cấu hình danh mục";
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

  export const useProductConfigQueryParams = () => {
    const query = useQueryParams();
    const limit = query.get("limit") || null;
    const page = query.get("page") || null;
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
    }, [page, limit,status, keyword, createSuccess, updateSuccess, deleteSuccess]);
  };
  
  export const useUpdateProductConfigParams = (
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
  export const useGetlistProductConfig = (query: any) => {
      return useFetchByParam({
        action: productConfigSliceAction.getListRequest,
        loadingSelector: loadingSelector,
        dataSelector: listSelector,
        failedSelector: getListFailedSelector,
        param: query,
      })
  }
  export const useGetlistProductConfigById = (id: string) => {
    console.log(id)
    return useFetchByParam({
      action: productConfigSliceAction.getByIdRequest,
      loadingSelector: getByIdLoadingSelector,
      dataSelector: getByIdSelector,
      failedSelector: getByIdFailedSelector,
      param: id,
    });
  };
  export const useCreateProductConfig = (callBack:any) => {
    useSuccess(createSuccessSelector, `Thêm ${MODULE_VI} thành công`, callBack);
    useFailed(createFailedSelector);
    return useSubmit({
        action: productConfigSliceAction.createRequest,
        loadingSelector: isSubmitLoadingSelector,
    })
  }
  export const useUpdateProductConfig = (callBack:any) => {
    useSuccess(updateSuccessSelector, `Cập nhật ${MODULE_VI} thành công`, callBack);
    useFailed(updateFailedSelector);
    return useSubmit({
        action: productConfigSliceAction.updateRequest,
        loadingSelector: isSubmitLoadingSelector,

    })
  }
 export const useDeleteProductConfig =(callBack:any)=>{
    useSuccess(deleteSuccessSelector, `Xóa ${MODULE_VI} thành công`, callBack);
    useFailed(deleteFailedSelector);
    return useSubmit({ 
        action: productConfigSliceAction.deleteRequest,
        loadingSelector: isSubmitLoadingSelector,
    })
  }
  export const useProductConfigPaging = () => useSelector(pagingSelector);