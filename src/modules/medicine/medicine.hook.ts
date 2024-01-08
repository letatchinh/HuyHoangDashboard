import { useResetState } from "~/utils/hook";
import { medicineSliceAction } from "./redux/reducer";
import { 
  getSelectors,
  useFailed,
  useFetch,
  useFetchByParam,
  useQueryParams,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
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

export const useMedicineQueryParams = () => {
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

export const useUpdateMedicineParams = (
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
      action: medicineSliceAction.getListRequest,
      loadingSelector: loadingSelector,
      dataSelector: listSelector,
      failedSelector: getListFailedSelector,
      param: query,
    })
}
export const useGetListMeddicine = (query: any) => {
  return useFetchByParam({
    action: medicineSliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param: query,
  });
}
export const useUpdateMedicine=(callBack?:any)=>{
  useSuccess(updateSuccessSelector,`Cập nhật ${MODULE_VI} thành công`, callBack);
  useFailed(updateFailedSelector);
  return useSubmit({
      action: medicineSliceAction.updateRequest,
      loadingSelector: isSubmitLoadingSelector,
  })
}
export const useCreateMedicine=(callBack?:any)=>{
  useSuccess(createSuccessSelector,`Tạo ${MODULE_VI} thành công`, callBack);
  useFailed(createFailedSelector);
  return useSubmit({
      action: medicineSliceAction.createRequest,
      loadingSelector: isSubmitLoadingSelector,
  })
}

export const useDeleteMedicine =(callBack?:any)=>{
   useSuccess(deleteSuccessSelector, `Xóa ${MODULE_VI} thành công`, callBack);
   useFailed(deleteFailedSelector);
   return useSubmit({ 
       action: medicineSliceAction.deleteRequest,
       loadingSelector: isSubmitLoadingSelector,
   })
}
export const useResetAction = () => {
    return useResetState(medicineSliceAction.resetAction);
  };