import { 
    getSelectors,
    useFailed,
    useFetch,
    useFetchByParam,
    useQueryParams,
    useResetState,
    useSubmit,
    useSuccess,
 } from "~/utils/hook";
import { workBoardActions } from "./redux/reducer";
import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { get, identity } from "lodash";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import { useSelector } from "react-redux";
import { cloneInitState } from "./workBoard.modal";
import { RootState } from "~/redux/store";
const MODULE = "workBoard";
const MODULE_VI = "Đơn vị tính";
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
  const getSelector = (key: keyof cloneInitState) => (state: RootState) =>
  state[MODULE][key];
  export const useWorkBoardQueryParams = () => {
    const query = useQueryParams();
    const limit = query.get("limit") || null;
    const page = query.get("page") || null;
    const keyword = query.get("keyword");
    const status = query.get("status");
    const createSuccess = useSelector(createSuccessSelector);
    const updateSuccess = useSelector(updateSuccessSelector);
    const deleteSuccess = useSelector(deleteSuccessSelector);
    return useMemo(() => {
      const queryParams = {
        page,
        limit,
        keyword,
        status,
      };
      return [queryParams];
      //eslint-disable-next-line
    }, [page, limit,status, keyword, createSuccess, updateSuccess, deleteSuccess]);
  };
  const allManagers = getSelector("allManagers");
  const isLoadingGetAllManagers = getSelector("isLoadingGetAllManagers");
  const getAllManagersFailed = getSelector("getAllManagersFailed");
  const allEmployee = getSelector("allEmployee");
  const isLoadingGetAllEmployee = getSelector("isLoadingGetAllEmployee");
  const getAllEmployeeFailed = getSelector("getAllEmployeeFailed");
  const listBoard = getSelector("listBoard");
  const isLoadingGetListBoard = getSelector("isGetListBoard");
  const getListBoardFailed = getSelector("getListBoardFailed");
  const listManagerById = getSelector("listManagerById");
  const isLoadingGetListManagerById = getSelector("isLoadingGetListManagerById");
  const getListManagerByIdFailed = getSelector("getListManagerByIdFailed");
  const listEmployeeById = getSelector("listEmployeeById");
  const isLoadingListEmployeeById = getSelector("isLoadingListEmployeeById");
  const getListEmployeeByIdFailed = getSelector("getListEmployeeByIdFailed");
  export const useUpdateWorkBoardParams = (
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
  export const useGetlistWorkBoard = (query?: any) => {
      return useFetchByParam({
        action: workBoardActions.getListRequest,
        loadingSelector: loadingSelector,
        dataSelector: listSelector,
        failedSelector: getListFailedSelector,
        param: query,
      })
  }
  export const useGetBoardById = (id?: string) => {
    console.log(id)
    return useFetchByParam({
      action: workBoardActions.getByIdRequest,
      loadingSelector: getByIdLoadingSelector,
      dataSelector: getByIdSelector,
      failedSelector: getByIdFailedSelector,
      param: id,
    });
  };
  export const useGetListManagers = () => {
    return useFetch({
      action: workBoardActions.getAllManagersRequest,
      loadingSelector: isLoadingGetAllManagers,
      dataSelector: allManagers,
      failedSelector: getAllManagersFailed,
    })
  };
  export const useGetListStaffs = () => {
    return useFetch({
      action: workBoardActions.getAllEmployeeRequest,
      loadingSelector: isLoadingGetAllEmployee,
      dataSelector: allEmployee,
      failedSelector: getAllEmployeeFailed,
    })
  };
  export const useGetListManagersByIdBoard = (id?:string) => {
    return useFetchByParam({
      action: workBoardActions.getListManagerByIdRequest,
      loadingSelector: isLoadingGetListManagerById,
      dataSelector: listManagerById,
      failedSelector: getListManagerByIdFailed,
      param: id
    })
  };
  export const useGetListStaffsByIdBoard = (id?:string) => {
    return useFetchByParam({
      action: workBoardActions.getListEmployeeByIdRequest,
      loadingSelector: isLoadingListEmployeeById,
      dataSelector: listEmployeeById,
      failedSelector: getListEmployeeByIdFailed,
      param: id
    })
  };
  export const useGetListBoard = () => {
    return useFetch({
      action: workBoardActions.getListBoardRequest,
      loadingSelector: isLoadingGetListBoard,
      dataSelector: listBoard,
      failedSelector: getListBoardFailed,
    })
  };
  export const useCreateWorkBoard = (callBack?:any) => {
    useSuccess(createSuccessSelector, `Thêm ${MODULE_VI} thành công`, callBack);
    useFailed(createFailedSelector);
    return useSubmit({
        action: workBoardActions.createRequest,
        loadingSelector: isSubmitLoadingSelector,
    })
  };
  export const useUpdateWorkBoard = (callBack?:any) => {
    useSuccess(updateSuccessSelector, `Cập nhật ${MODULE_VI} thành công`, callBack);
    useFailed(updateFailedSelector);
    return useSubmit({
        action: workBoardActions.updateRequest,
        loadingSelector: isSubmitLoadingSelector,

    })
  };
 export const useDeleteWorkBoard =(callBack?:any)=>{
    useSuccess(deleteSuccessSelector, `Xóa ${MODULE_VI} thành công`, callBack);
    useFailed(deleteFailedSelector);
    return useSubmit({ 
        action: workBoardActions.deleteRequest,
        loadingSelector: isSubmitLoadingSelector,
    })
  };
  export const useWorkBoardPaging = () => useSelector(pagingSelector);
  export const useResetAction = () => {
    return useResetState(workBoardActions.resetAction);
  };