import {
    getSelectors,
    useFailed, 
    useFetchByParam,
    useQueryParams,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { testActions } from "./redux";
import { useSelector } from "react-redux";
import { useMemo } from "react";
const MODULE = "test";

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
  getSelector,

} = getSelectors(MODULE);

export const useGetTestList = (param:any) => {
  return useFetchByParam({
    action: testActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useTestListQueryParams = () => {
    const query = useQueryParams();
    const limit = query.get("limit") || 10;
    const page = query.get("page") || 1;
    const keyword = query.get("keyword");
    const createSuccess = useSelector(createSuccessSelector);
    const deleteSuccess = useSelector(deleteSuccessSelector);
    return useMemo(() => {
      const queryParams = {
        page,
        limit,
        keyword,
      };
      return [queryParams];
      //eslint-disable-next-line
    }, [page, limit, keyword, createSuccess, deleteSuccess]);
  };