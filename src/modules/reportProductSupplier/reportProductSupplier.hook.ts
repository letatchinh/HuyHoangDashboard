// Please UnComment To use

import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
// import { useEffect, useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
  
    useQueryParams,
    useSubmit,
    useSuccess
} from "~/utils/hook";
// import { reportProductSupplierActions } from "./redux/reducer";
// const MODULE = "reportProductSupplier";
// const MODULE_VI = "";

// const {
//   loadingSelector,
//   listSelector,
//   getListFailedSelector,
//   getByIdLoadingSelector,
//   getByIdSelector,
//   getByIdFailedSelector,
//   deleteSuccessSelector,
//   deleteFailedSelector,
//   isSubmitLoadingSelector,
//   createSuccessSelector,
//   createFailedSelector,
//   updateSuccessSelector,
//   updateFailedSelector,
//   pagingSelector,
// } = getSelectors(MODULE);

// export const useReportProductSupplierPaging = () => useSelector(pagingSelector);

// export const useGetReportProductSuppliers = (param:any) => {
//   return useFetchByParam({
//     action: reportProductSupplierActions.getListRequest,
//     loadingSelector: loadingSelector,
//     dataSelector: listSelector,
//     failedSelector: getListFailedSelector,
//     param
//   });
// };
// export const useGetReportProductSupplier = (id: any) => {
//   return useFetchByParam({
//     action: reportProductSupplierActions.getByIdRequest,
//     loadingSelector: getByIdLoadingSelector,
//     dataSelector: getByIdSelector,
//     failedSelector: getByIdFailedSelector,
//     param: id,
//   });
// };

// export const useCreateReportProductSupplier = (callback?: any) => {
//   useSuccess(
//     createSuccessSelector,
//     `Tạo mới ${MODULE_VI} thành công`,
//     callback
//   );
//   useFailed(createFailedSelector);

//   return useSubmit({
//     action: reportProductSupplierActions.createRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

// export const useUpdateReportProductSupplier = (callback?: any) => {
//   useSuccess(
//     updateSuccessSelector,
//     `Cập nhật ${MODULE_VI} thành công`,
//     callback
//   );
//   useFailed(updateFailedSelector);

//   return useSubmit({
//     action: reportProductSupplierActions.updateRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

// export const useDeleteReportProductSupplier = (callback?: any) => {
//   useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
//   useFailed(deleteFailedSelector);

//   return useSubmit({
//     action: reportProductSupplierActions.deleteRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

export const useReportProductSupplierQueryParams = () => {
  const query = useQueryParams();

  // spaceType?: any;
  // dataType?: keyof typeof TYPE_REPORT;
  // rangerTime?: any;
  // rangerType?: any;
  const dataType = query.get("dataType")
  const rangerTime = query.get("rangerTime")
  const rangerType = query.get("rangerType")
  return useMemo(() => {
    const queryParams = {
    dataType,
    rangerTime,
    rangerType,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [dataType, rangerTime, rangerType]);
};

export const useUpdateReportProductSupplierParams = (
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
