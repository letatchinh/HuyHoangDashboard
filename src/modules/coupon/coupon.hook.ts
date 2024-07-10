
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetchByParam,
    useFetchState,
    useQueryParams,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { ColumnsType } from "antd/lib/table/InternalTable"

import { couponActions } from "./redux/reducer";
import apis from "./coupon.api";
import { CouponInSelect } from "./coupon.modal";
const MODULE = "coupon";
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

export const useCouponPaging = () => useSelector(pagingSelector);

export const useGetCoupons = (param:any) => {
  return useFetchByParam({
    action: couponActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetCoupon = (id: any) => {
  return useFetchByParam({
    action: couponActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateCoupon = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: couponActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateCoupon = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: couponActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteCoupon = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: couponActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useCouponQueryParams = () => {
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

export const useUpdateCouponParams = (
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

export const useCouponSelect = (bill : any) => {
  const countProduct = get(bill,'quotationItems',[])?.reduce((sum : number,cur : any) => sum + get(cur,'quantity',0),0)
  const [couponSelected,setCouponSelected] = useState({
    bill : [],
    ship : [],
    item : [],
  });
  const onChangeCoupleSelect = (target : "bill" | "ship" | "item",newCoupon : CouponInSelect[]) => {
    setCouponSelected({
      ...couponSelected,
      [target] : newCoupon
    })
  }
  const [query,setQuery] = useState({});
  const [coupons,loading] = useFetchState({api : apis.search,query,useDocs : false});
  return {couponSelected,setCouponSelected,onChangeCoupleSelect,setQuery,coupons,loading,countProduct}
}