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
const MODULE_VI = "cộng tác viên";

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

export const useCollaboratorQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const status = query.get("status");
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
      processStatus,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, status, keyword, processStatus, createSuccess, updateSuccess, deleteSuccess, convertSuccess]);
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