
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
import { reportShipActions } from "./redux/reducer";
const MODULE = "reportShip";
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
export const useReportShipPaging = () => useSelector(pagingSelector);

export const useGetReportShips = (param:any) => {
  return useFetchByParam({
    action: reportShipActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetReportSummaryShips = (param:any) => {
  return useFetchByParam({
    action: reportShipActions.getSummaryRequest,
    loadingSelector: summaryLoadingSelector,
    dataSelector: summaryDataSelector,
    failedSelector: summaryFailedSelector,
    param
  });
};

export const useReportShipQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const startDate = query.get("startDate");
  const endDate = query.get("endDate");
  const serviceName = query.get("serviceName");
  const transportUnit = query.get("transportUnit");
  const payer = query.get("payer");
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      startDate,
      endDate,
      serviceName,
      transportUnit,
      payer,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword,startDate,endDate,serviceName,transportUnit,payer]);
};

export const useUpdateReportShipParams = (
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
