// Please UnComment To use

import { get } from "lodash";
// import { useEffect, useMemo, useState } from "react";
// import { useSelector } from "react-redux";
// import { useLocation, useNavigate } from "react-router-dom";
// import { clearQuerySearch, getExistProp } from "~/utils/helpers";
// import {
//     getSelectors,
//     useFailed, useFetchByParam,
//     useQueryParams,
//     useSubmit,
//     useSuccess
// } from "~/utils/hook";
// import { billItemSliceAction } from "./redux/reducer";
// const MODULE = "billItem";
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

// export const useBillItemPaging = () => useSelector(pagingSelector);

// export const useGetBillItems = (param:any) => {
//   return useFetchByParam({
//     action: billItemSliceAction.getListRequest,
//     loadingSelector: loadingSelector,
//     dataSelector: listSelector,
//     failedSelector: getListFailedSelector,
//     param
//   });
// };
// export const useGetBillItem = (id: any) => {
//   return useFetchByParam({
//     action: billItemSliceAction.getByIdRequest,
//     loadingSelector: getByIdLoadingSelector,
//     dataSelector: getByIdSelector,
//     failedSelector: getByIdFailedSelector,
//     param: id,
//   });
// };

// export const useCreateBillItem = (callback?: any) => {
//   useSuccess(
//     createSuccessSelector,
//     `Tạo mới ${MODULE_VI} thành công`,
//     callback
//   );
//   useFailed(createFailedSelector);

//   return useSubmit({
//     action: billItemSliceAction.createRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

// export const useUpdateBillItem = (callback?: any) => {
//   useSuccess(
//     updateSuccessSelector,
//     `Cập nhật ${MODULE_VI} thành công`,
//     callback
//   );
//   useFailed(updateFailedSelector);

//   return useSubmit({
//     action: billItemSliceAction.updateRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

// export const useDeleteBillItem = (callback?: any) => {
//   useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
//   useFailed(deleteFailedSelector);

//   return useSubmit({
//     action: billItemSliceAction.deleteRequest,
//     loadingSelector: isSubmitLoadingSelector,
//   });
// };

// export const useBillItemQueryParams = () => {
//   const query = useQueryParams();
//   const limit = query.get("limit") || 10;
//   const page = query.get("page") || 1;
//   const keyword = query.get("keyword");
//   const createSuccess = useSelector(createSuccessSelector);
//   const deleteSuccess = useSelector(deleteSuccessSelector);
//   return useMemo(() => {
//     const queryParams = {
//       page,
//       limit,
//       keyword,
//     };
//     return [queryParams];
//     //eslint-disable-next-line
//   }, [page, limit, keyword, createSuccess, deleteSuccess]);
// };

// export const useUpdateBillItemParams = (
//   query: any,
//   listOptionSearch?: any[]
// ) => {
//   const navigate = useNavigate();
//   const { pathname } = useLocation();
//   const [keyword, setKeyword] = useState(get(query, "keyword"));
//   useEffect(() => {
//     setKeyword(get(query, "keyword"));
//   }, [query]);
//   const onParamChange = (param: any) => {
//     // Clear Search Query when change Params
//     clearQuerySearch(listOptionSearch, query, param);

//     if (!param.page) {
//       query.page = 1;
//     };

//     // Convert Query and Params to Search Url Param
//     const searchString = new URLSearchParams(
//       getExistProp({
//         ...query,
//         ...param,
//       })
//     ).toString();

//     // Navigate
//     navigate(`${pathname}?${searchString}`);
//   };

//   return [keyword, { setKeyword, onParamChange }];
// };
