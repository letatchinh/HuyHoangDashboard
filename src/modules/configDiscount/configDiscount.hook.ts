
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetch, useFetchByParam,
    useQueryParams,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { configDiscountSliceAction } from "./redux/reducer";
const MODULE = "configDiscount";
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
const getSelector = (key: string) => (state: any) => state.configDiscount[key];
const updateListSuccessSelector = getSelector("updateListSuccess");
const updateListFailedSelector = getSelector("updateListFailed");

export const useConfigDiscountPaging = () => useSelector(pagingSelector);

export const useGetConfigDiscounts = () => {
  return useFetch({
    action: configDiscountSliceAction.getListRequest,
    loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    // param
  });
};

export const useUpdateConfigDiscount = (callback?: any) => {
  useSuccess(
    updateListSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateListFailedSelector);

  return useSubmit({
    action: configDiscountSliceAction.updateRequest,
    loadingSelector,
  });
};
// export const useGetConfigDiscount = (id: any) => {
//   return useFetchByParam({
//     action: configDiscountSliceAction.getByIdRequest,
//     loadingSelector: getByIdLoadingSelector,
//     dataSelector: getByIdSelector,
//     failedSelector: getByIdFailedSelector,
//     param: id,
//   });
// };

// export const useCreateConfigDiscount = (callback?: any) => {
//   useSuccess(
//     createSuccessSelector,
//     `Tạo mới ${MODULE_VI} thành công`,
//     callback
//   );
//   useFailed(createFailedSelector);

//   return useSubmit({
//     action: configDiscountSliceAction.createRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };



// export const useDeleteConfigDiscount = (callback?: any) => {
//   useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
//   useFailed(deleteFailedSelector);

//   return useSubmit({
//     action: configDiscountSliceAction.deleteRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

export const useConfigDiscountQueryParams = () => {
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
  }, [page, limit, keyword, createSuccess, deleteSuccess]);
};

export const useUpdateConfigDiscountParams = (
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
