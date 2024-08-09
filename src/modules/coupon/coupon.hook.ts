
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
import { CouponInSelect, QuerySearchCoupon } from "./coupon.modal";
import { quotation } from "../sale/bill/bill.modal";
const MODULE = "coupon";
const MODULE_VI = "";
const getSelector = (key : any) => (state : any) => state[MODULE][key];

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

const copySuccessSelector = getSelector('copySuccess')
const copyFailedSelector = getSelector('copyFailed')
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

export const useCopyCoupon = (callback?: any) => {
  useSuccess(copySuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(copyFailedSelector);

  return useSubmit({
    action: couponActions.copyRequest,
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
  const copySuccess = useSelector(copySuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess,copySuccess]);
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


export const useCouponSelect = ({bill,refCollection,totalAmount,quotationItems} : {bill : any,refCollection : any ,totalAmount:number,quotationItems : quotation[]}) => {
  const [isOpenCoupon,setIsOpenCoupon] = useState(false);
  const [isOpenCouponBillItem,setIsOpenCouponBillItem] = useState(false);
  const countProduct = get(bill,'quotationItems',[])?.reduce((sum : number,cur : any) => sum + get(cur,'quantity',0),0)
  const [couponSelected,setCouponSelected] = useState<{
    bill : CouponInSelect[],
    ship : CouponInSelect[],
    item : CouponInSelect[],
  }>({
    bill : [],
    ship : [],
    item : [],
  });
  const onChangeCoupleSelect = (newCoupon : any) => {
    setCouponSelected({
      ...couponSelected,
      ...newCoupon,
    })
  };
  const [query,setQuery] = useState<QuerySearchCoupon>({
    target : "BILL"
  });
  const [queryBillItem,setQueryBillItem] = useState<QuerySearchCoupon>({
    target : "BILL_ITEM"
  });
  const [coupons,loading] = useFetchState({api : apis.search,query,useDocs : false});
  const [couponsBillItem,loadingCouponBillItem] = useFetchState({api : apis.search,query : queryBillItem,useDocs : false});
  
  const onOpenCoupon = () => {
    setIsOpenCoupon(true);
    setQuery({
      ...query,
      customerApplyId : {
        refCollection,
        id : get(bill, "pharmacyId")
      },
      productCount : countProduct,
      billPrice : totalAmount
    });
  };

  const onCloseCoupon = () => {
    setIsOpenCoupon(false);
  };
  const onOpenCouponBillItem = (productId? : string,variantId ? : string,productGroupId? : string) => {
    const productTargetCount = quotationItems?.reduce((sum : number,cur : quotation) => cur?.productId === productId ? sum + get(cur,'quantity',0) : sum,0);
    const productTargetPrice = quotationItems?.reduce((sum : number,cur : quotation) => cur?.productId === productId ? sum + get(cur,'totalRoot',0) : sum,0);
    const productGroupTargetCount = quotationItems?.reduce((sum : number,cur : quotation) => cur?.productGroupId === productGroupId ? sum + get(cur,'quantity',0) : sum,0);
    const productGroupTargetPrice = quotationItems?.reduce((sum : number,cur : quotation) => cur?.productGroupId === productGroupId ? sum + get(cur,'totalRoot',0) : sum,0);
    setIsOpenCouponBillItem(true);
    setQueryBillItem({
      ...queryBillItem,
      variantId,
      customerApplyId : {
        refCollection,
        id : get(bill, "pharmacyId")
      },
      productCount : productTargetCount,
      productGroupCount : productGroupTargetCount,
      billPrice : productTargetPrice,
      billGroupPrice : productGroupTargetPrice
    });
  };

  const onCloseCouponBillItem = () => {
    setIsOpenCouponBillItem(false);
  };

  return {
    couponSelected,
    setCouponSelected,
    onChangeCoupleSelect,
    coupons,
    loading,
    countProduct,
    isOpenCoupon,
    onCloseCoupon,
    onOpenCoupon,
    onOpenCouponBillItem,
    onCloseCouponBillItem,
    isOpenCouponBillItem,
    couponsBillItem,
    loadingCouponBillItem,
    queryBillItem,
  };
}