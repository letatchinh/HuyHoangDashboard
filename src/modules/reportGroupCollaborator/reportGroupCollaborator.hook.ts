import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useFailed, useFetchByParam,
    useQueryParams,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { reportGroupCollaboratorActions } from "./redux/reducer";
const MODULE = "reportGroupCollaborator";
const MODULE_VI = "";

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

export const useReportGroupCollaboratorPaging = () => useSelector(pagingSelector);

export const useGetReportGroupCollaborators = (param:any) => {
  return useFetchByParam({
    action: reportGroupCollaboratorActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetReportGroupCollaborator = (id: any) => {
  return useFetchByParam({
    action: reportGroupCollaboratorActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useCreateReportGroupCollaborator = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: reportGroupCollaboratorActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateReportGroupCollaborator = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: reportGroupCollaboratorActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteReportGroupCollaborator = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: reportGroupCollaboratorActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useReportGroupCollaboratorQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  // const keyword = query.get("keyword");
  // const rangerTime = query.get("rangerTime");
  // const rangerType = query.get("rangerType");
  const getByRanger = query.get("getByRanger");
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      // rangerTime,
      // rangerType,
      // datatype,
      getByRanger,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit,   getByRanger]);
};

export const useUpdateReportGroupCollaboratorParams = (
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
