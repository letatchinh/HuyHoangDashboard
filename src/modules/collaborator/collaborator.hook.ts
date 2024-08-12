// Please UnComment To use
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetchByParam,
    useQueryParams,
    useResetState,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { collaboratorActions } from "./redux/reducer";
import { RootState } from "~/redux/store";
const MODULE = "collaborator";
const MODULE_VI = "khách hàng B2C";

const getSelector = (key: string) => (state: any) => state.collaborator[key];
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
const convertSuccessSelector = getSelector("convertSuccess");
const convertFailedSelector = getSelector("convertFailed");

const addProductSuccessSelector = getSelector("addProductSuccess");
const addProductFailedSelector = getSelector("addProductFailed");

const removeProductSuccessSelector = getSelector("removeProductSuccess");
const removeProductFailedSelector = getSelector("removeProductFailed");

const updateProductSuccessSelector = getSelector("updateProductSuccess");
const updateProductFailedSelector = getSelector("updateProductFailed");

const updateAddressSuccessSelector = getSelector("updateAddressSuccess");
const updateAddressFailedSelector = getSelector("updateAddressFailed");

export const useCollaboratorPaging = () => useSelector(pagingSelector);

export const useGetCollaborators = (param:any) => {
  return useFetchByParam({
    action: collaboratorActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetCollaborator = (id: any) => {
  return useFetchByParam({
    action: collaboratorActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};
export const useGetCollaborator_onlyGet = () => [useSelector(getByIdSelector),useSelector(getByIdLoadingSelector)];
export const useGetCollaborator_redux = () => [useSelector(getByIdSelector),useSelector(getByIdLoadingSelector)];
export const useCreateCollaborator = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: collaboratorActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateCollaborator = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: collaboratorActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteCollaborator = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: collaboratorActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useConvertCollaborator = (callback?: any) => {
  useSuccess(
    convertSuccessSelector,
    `Duyệt ${MODULE_VI} thành công`,
    callback
  );
  useFailed(convertFailedSelector);

  return useSubmit({
    action: collaboratorActions.convertRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useAddProductCollaborator = (callback?: any) => {
  useSuccess(
    addProductSuccessSelector,
    '',
    callback
  );
  useFailed(addProductFailedSelector);

  return useSubmit({
    action: collaboratorActions.addProductRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useRemoveProductCollaborator = (callback?: any) => {
  useSuccess(
    removeProductSuccessSelector,
    ``,
    callback
  );
  useFailed(removeProductFailedSelector);

  return useSubmit({
    action: collaboratorActions.removeProductRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateProductCollaborator = (callback?: any) => {
  useSuccess(
    updateProductSuccessSelector,
    '',
    callback
  );
  useFailed(updateProductFailedSelector);

  return useSubmit({
    action: collaboratorActions.updateProductRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useCollaboratorQueryParams = (limitDefault? : number) => {
  const query = useQueryParams();
  const limit = query.get("limit") || limitDefault || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const status = query.get("status");
  const salesChannel = query.get("salesChannel");
  const processStatus = query.get("processStatus");
  const createSuccess = useSelector(createSuccessSelector);
  const updateSuccess = useSelector(updateSuccessSelector)
  const deleteSuccess = useSelector(deleteSuccessSelector);
  const convertSuccess = useSelector(convertSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      status,
      salesChannel,
      processStatus,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, status, salesChannel, keyword, processStatus, createSuccess, updateSuccess, deleteSuccess, convertSuccess]);
};

export const useUpdateCollaboratorParams = (
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

export const useResetCollaboratorAction = () => {
  useResetState(collaboratorActions.resetAction);
};

export const useUpdateAddressCollaborator = (callback?: any) => {
  useSuccess(
    updateAddressSuccessSelector,
    ``,
    callback
  );
  useFailed(updateAddressFailedSelector);

  return useSubmit({
    action: collaboratorActions.updateAddressRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};
