import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
  getSelectors, useFetchByParam,
  useQueryParams, useResetState
} from "~/utils/hook";
import { medicineSliceAction } from "./redux/reducer";
const MODULE = "medicine";
const MODULE_VI = "thuốc";
const {
  loadingSelector,
  listSelector,
  getListFailedSelector,
  getByIdLoadingSelector,
  getByIdSelector,
  getByIdFailedSelector,
  pagingSelector,
} = getSelectors(MODULE);

export const useMedicineQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || null;
  const page = query.get("page") || null;
  const keyword = query.get("keyword");
  const status = query.get("status");
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      status,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit,status, keyword]);
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
export const useGetListMeddicine = (query: any) => {
  return useFetchByParam({
    action: medicineSliceAction.getListRequest,
    loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param: query,
  });
}
export const useGetMedicineById = (id: String) => {
  return useFetchByParam({
    action: medicineSliceAction.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
}
export const useResetAction = () => {
    return useResetState(medicineSliceAction.resetAction);
  };

export const useMedicinePaging =()=> useSelector(pagingSelector)