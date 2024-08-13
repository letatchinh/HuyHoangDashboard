
import dayjs from "dayjs";
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors, useFetchByParam,
    useQueryParams
} from "~/utils/hook";
import { reportSubFeeActions } from "./redux/reducer";
const MODULE = "reportSubFee";
const getSelector = (key : any) => (state : any) => state[MODULE][key];

const {
  loadingSelector,
  listSelector,
  getListFailedSelector,
  pagingSelector,
} = getSelectors(MODULE);

const summaryDataSelector = getSelector("summaryData");
const summaryLoadingSelector = getSelector("summaryLoading");
const summaryFailedSelector = getSelector("summaryFailed");
export const useReportSubFeePaging = () => useSelector(pagingSelector);

export const useGetReportSubFees = (param:any) => {
  return useFetchByParam({
    action: reportSubFeeActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetReportSummarySubFees = (param:any) => {
  return useFetchByParam({
    action: reportSubFeeActions.getSummaryRequest,
    loadingSelector: summaryLoadingSelector,
    dataSelector: summaryDataSelector,
    failedSelector: summaryFailedSelector,
    param
  });
};

export const useReportSubFeeQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const startDate = query.get("startDate")
  const endDate = query.get("endDate")
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      startDate,
      endDate,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword,startDate,endDate]);
};

export const useUpdateReportSubFeeParams = (
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
