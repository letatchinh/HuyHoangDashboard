
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, compactAddress, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetchByParam,
    useQueryParams,
    useResetState,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { receiptVoucherSliceAction } from "./redux/reducer";
import { REF_COLLECTION, TYPE_VOUCHER } from "~/constants/defaultValue";
import dayjs from "dayjs";
import { fromJSON } from "../vouchers/components/parser";
import { PATH_APP } from "~/routes/allPath";

const MODULE = "receiptVoucher";
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
const getSelector = (key: string) => (state: any) => state.receiptVoucher[key];
export const useReceiptVoucherPaging = () => useSelector(pagingSelector);
const confirmReceiptSuccessSelector = getSelector('confirmSuccess');
const confirmReceiptFailedSelector = getSelector('confirmFailed');

export const useGetReceiptVouchers = (param:any) => {
  return useFetchByParam({
    action: receiptVoucherSliceAction.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetReceiptVoucher = (id: any) => {
  return useFetchByParam({
    action: receiptVoucherSliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateReceiptVoucher = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: receiptVoucherSliceAction.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateReceiptVoucher = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: receiptVoucherSliceAction.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useConfirmReceiptVoucher = (callback?: any) => {
  useSuccess(
    confirmReceiptSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công `,
    callback
  );
  useFailed(confirmReceiptFailedSelector);

  return useSubmit({
    action: receiptVoucherSliceAction.confirmReceiptVoucherRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteReceiptVoucher = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: receiptVoucherSliceAction.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useReceiptVoucherQueryParams = () => {
  const query = useQueryParams();
  const {pathname} = useLocation() 
  const typeVoucher = TYPE_VOUCHER.PT;
  const [limit, setLimit] = useState(query.get("limit") || 10); 
  const [page, setPage] = useState(query.get("page") || 1);
  const keyword = query.get("keyword");
  const codeSequence = query.get("codeSequence");
  const status = query.get("status");
  const totalAmount = query.get("totalAmount");
  const reason = query.get("reason");
  const startDate = query.get('startDate') || dayjs().startOf('month').format("YYYY-MM-DDTHH:mm:ss");

  const endDate = query.get('endDate') || dayjs().endOf('month').format("YYYY-MM-DDTHH:mm:ss");
  const createSuccess = useSelector(createSuccessSelector);
  const deleteSuccess = useSelector(deleteSuccessSelector);

  const onTableChange : any = ({ current, pageSize }: any) => {
    setLimit(pageSize);
    setPage(current);
  };

  // TODO: Default RefCollection By PathName
  let refCollection : 'pharma_profile' | 'supplier' | null = null;
  if(pathname === PATH_APP.vouchers.pharmacy ){
    refCollection = REF_COLLECTION.PHARMA_PROFILE
  }
  if(pathname === PATH_APP.vouchers.supplier ){
    refCollection = REF_COLLECTION.SUPPLIER
  }
  
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      typeVoucher,
      keyword,
      endDate,
      startDate,
      codeSequence,
      status,
      totalAmount,
      reason,
      ...refCollection && {refCollection}
    };
    return [queryParams,onTableChange];
    //eslint-disable-next-line
  }, [page, limit, keyword, createSuccess, deleteSuccess,startDate, endDate,codeSequence, status, totalAmount, reason,pathname]);
};

export const useUpdateReceiptVoucherParams = (
  query: any,
  listOptionSearch?: any[]
) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [keyword, setKeyword] = useState(query.keyword);
  // useEffect(() => {
  //   setKeyword(get(query, "keyword"));
  // }, [query]);
  
  const onParamChange = (param?: any) => {
    // Clear Search Query when change Params
    clearQuerySearch(listOptionSearch, query, param);

    if (!param?.page) {
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
  return useResetState(receiptVoucherSliceAction.resetAction);
};

export const useInitWhReceiptVoucher = (whReceiptVoucher: any) => {
  return useMemo(() => {
    if (!whReceiptVoucher) {
      return {
      };
    };
    const { accountingDetail, dateOfIssue,pharmaProfile, ...rest } = whReceiptVoucher;
    const newValue = {
      ...rest,
      accountingDate: dayjs(accountingDetail?.accountingDate),
      dateOfIssue: dayjs(dateOfIssue),
      name: pharmaProfile?.name,
      address: compactAddress(pharmaProfile?.address),
    };
    const initValues = {
      ...fromJSON(newValue),
    };
    return initValues;
  }, [whReceiptVoucher]);
};