
import { get } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetch,
  useFetchByParam,
  useQueryParams,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { botNotificationActions } from "./redux/reducer";
const MODULE = "botNotification";
const MODULE_VI = "thông báo tự động Email";

const {
  loadingSelector,
  listSelector,
  getListFailedSelector,
  isSubmitLoadingSelector,
  updateSuccessSelector,
  updateFailedSelector,
  pagingSelector,
} = getSelectors(MODULE);

export const useBotNotificationPaging = () => useSelector(pagingSelector);

export const useGetBotNotifications = (param: any) => {
  return useFetchByParam({
    action: botNotificationActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};

export const useUpdateBotNotification = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: botNotificationActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useBotNotificationQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const updateSuccess = useSelector(updateSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword, updateSuccess]);
};
