
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, compactAddress, getExistProp } from "~/utils/helpers";
import { fromJSON } from "../vouchers/components/parser";
import {
    getSelectors,
    useFailed, useFetchByParam,
    useQueryParams,
    useResetState,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { paymentVoucherSliceAction } from "./redux/reducer";
import { TYPE_VOUCHER } from "~/constants/defaultValue";
import dayjs from "dayjs";
const MODULE = "paymentVoucher";
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

const getSelector = (key: string) => (state: any) => state.paymentVoucher[key];

export const usePaymentVoucherPaging = () => useSelector(pagingSelector);
const confirmPaymentSuccessSelector = getSelector('confirmSuccess');
const confirmPaymentFailedSelector = getSelector('confirmFailed');

export const useGetPaymentVouchers = (param:any) => {
  return useFetchByParam({
    action: paymentVoucherSliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetPaymentVoucher = (id: any) => {
  return useFetchByParam({
    action: paymentVoucherSliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreatePaymentVoucher = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: paymentVoucherSliceAction.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdatePaymentVoucher = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: paymentVoucherSliceAction.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};
export const useConfirmPaymentVoucher = (callback?: any) => {
  useSuccess(
    confirmPaymentSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công `,
    callback
  );
  useFailed(confirmPaymentFailedSelector);

  return useSubmit({
    action: paymentVoucherSliceAction.confirmPaymentVoucherRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeletePaymentVoucher = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: paymentVoucherSliceAction.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const usePaymentVoucherQueryParams = () => {
  const query = useQueryParams();
  const typeVoucher = TYPE_VOUCHER.PC;
  const [limit, setLimit] = useState(query.get("limit") || 10); 
  const [page, setPage] = useState(query.get("page") || 1);
  const keyword = query.get("keyword");
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);
  const startDate = query.get('startDate') || dayjs().startOf('month').format("YYYY-MM-DDTHH:mm:ss");
  const endDate = query.get('endDate') || dayjs().endOf('month').format("YYYY-MM-DDTHH:mm:ss");
  const onTableChange : any = ({ current, pageSize }: any) => {
    setLimit(pageSize);
    setPage(current);
  };

  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      typeVoucher,
      startDate,
      endDate,
    };
    return [queryParams, onTableChange];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess, startDate, endDate]);
};

export const useUpdatePaymentVoucherParams = (
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

export const useResetAction = () => {
  return useResetState(paymentVoucherSliceAction.resetAction);
};

export const useInitWhPaymentVoucher = (whPaymentVoucher: any) => {
  return useMemo(() => {
    if (!whPaymentVoucher) {
      return {
      };
    };
    const { accountingDetail, dateOfIssue,supplier, ...rest } = whPaymentVoucher;
    const newValue = {
      ...rest,
      accountingDate: dayjs(accountingDetail?.accountingDate),
      dateOfIssue: dayjs(dateOfIssue),
      supplier: supplier?.name,
      supplierAddress: compactAddress(supplier?.address),
    };
    const initValues = {
      ...fromJSON(newValue),
    };
    return initValues;
  }, [whPaymentVoucher]);
};
