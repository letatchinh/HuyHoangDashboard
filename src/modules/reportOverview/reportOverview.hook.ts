// Please UnComment To use

import { get, omit, pick } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import { getSelectors, useFetchByParam, useQueryParams } from "~/utils/hook";
import { reportOverviewActions } from "./redux/reducer";
import { getReportProductbody } from "./reportOverview.modal";
const MODULE = "reportOverview";
const MODULE_VI = "";

const { loadingSelector, listSelector, getListFailedSelector, pagingSelector } =
  getSelectors(MODULE);

export const useReportOverviewPaging = () => useSelector(pagingSelector);

export const useGetReportProductSuppliers = (param: any) => {
  return useFetchByParam({
    action: reportOverviewActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param,
  });
};
export namespace hookReportType {
  export type propsHook = {
    pickFiled: Array<keyof getReportProductbody>;
    omitField: Array<keyof getReportProductbody>;
  };
}
export const useReportProductSupplierQueryParams = (
  props?: Partial<hookReportType.propsHook>
) => {
  const query = useQueryParams();
  const reportSize = query.get("reportSize") || 10;
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const spaceType = query.get("spaceType");
  const dataType = query.get("dataType");
  const rangerTime = query.get("rangerTime");
  const rangerType = query.get("rangerType");
  const supplierId = query.get("supplierId");
  const productId = query.get("productId");
  const customerId = query.get("customerId");
  const salerId = query.get("salerId");
  const areaId = query.get("areaId");
  const cityId = query.get("cityId");
  const salesChannelId = query.get("salesChannelId");
  return useMemo(() => {
    let queryParams: any = {
      reportSize,
      page,
      spaceType,
      dataType,
      rangerTime,
      rangerType,
      supplierId,
      productId,
      customerId,
      salerId,
      areaId,
      cityId,
      limit,
      salesChannelId,
    };
    if (props?.pickFiled?.length) {
      queryParams = pick(queryParams, props?.pickFiled);
    }
    if (props?.omitField?.length) {
      queryParams = omit(queryParams, props?.omitField);
    }
    return [queryParams];
    //eslint-disable-next-line
  }, [
    reportSize,
    page,
    spaceType,
    dataType,
    rangerTime,
    rangerType,
    supplierId,
    productId,
    customerId,
    salerId,
    areaId,
    cityId,
    limit,
    props?.pickFiled,
    props?.omitField,
    salesChannelId,
  ]);
};

export const useChangeParam = (query?: any) => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const onParamChange = (param: any) => {
    // Clear Search Query when change Params
    clearQuerySearch(query, param);
    if (!param.page) {
      query.page = 1;
    }
    // // Convert Query and Params to Search Url Param
    const searchString = new URLSearchParams(
      getExistProp({
        ...query,
        ...param,
      })
    ).toString();

    // Navigate
    navigate(`${pathname}?${searchString}`);
  };
  return onParamChange;
};

export const useUpdateReportProductSupplierParams = (query: any) => {
  const [keyword, setKeyword] = useState(get(query, "keyword"));
  useEffect(() => {
    setKeyword(get(query, "keyword"));
  }, [query]);
  const onParamChange = useChangeParam(query);

  return [keyword, { setKeyword, onParamChange }];
};
