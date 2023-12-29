import { getSelectors, useFetchByParam } from "~/utils/hook";
import { supplierSliceAction } from "./redux/reducer";
const MODULE = 'supplier';

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
  pagingSelector
} = getSelectors(MODULE);

export const useGetSuppliers = (params:any) => {
    return useFetchByParam({
      action: supplierSliceAction.getListRequest,
      loadingSelector: loadingSelector,
      dataSelector: listSelector,
      failedSelector: getListFailedSelector,
      param: params
    });
  };
export const useGetSupplier = (id:any) => {
    return useFetchByParam({
      action: supplierSliceAction.getByIdRequest,
      loadingSelector: getByIdLoadingSelector,
      dataSelector: getByIdSelector,
      failedSelector: getByIdFailedSelector,
      param: id
    });
  };