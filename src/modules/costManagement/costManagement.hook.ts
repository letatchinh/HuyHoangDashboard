
// Please UnComment To use

import { get, round } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
    getSelectors,
    useAction,
    useFailed, useFetchByParam,
    useQueryParams,
    useResetState,
    useSubmit,
    useSuccess
} from "~/utils/hook";
import { costManagementActions } from "./redux/reducer";
import dayjs from "dayjs";
const MODULE = "costManagement";
const MODULE_VI = "chi phí";

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

const getSelector = (key: any) => (state: any) => state.costManagement[key];
const totalRevenueSelector = getSelector('totalRevenue');
export const useTotalRevenue = () => useSelector(totalRevenueSelector);
export const useCostManagementPaging = () => useSelector(pagingSelector);

export const useGetCostManagements = (param?:any) => {
  return useFetchByParam({
    action: costManagementActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param
  });
};
export const useGetCostManagement = (id: any) => {
  return useFetchByParam({
    action: costManagementActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};
// export const useGetCostManagement = (param?: any) => {
//   return useFetchByParam({
//     action: costManagementActions.getByIdRequest,
//     loadingSelector: getByIdLoadingSelector,
//     dataSelector: getByIdSelector,
//     failedSelector: getByIdFailedSelector,
//     param,
//   });
// };

export const useCreateCostManagement = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: costManagementActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateCostManagement = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: costManagementActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteCostManagement = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: costManagementActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};
export const useProductConfigPaging = () => useSelector(pagingSelector);
export const useResetAction = () => {
  return useResetState(costManagementActions.resetActionFullState);
};
export const useCostManagementQueryParams = () => {
  const query = useQueryParams();
  const limit = query.get("limit") || 10;
  const page = query.get("page") || 1;
  const keyword = query.get("keyword");
  const startDate = query.get("startDate") || dayjs().startOf('month').format("YYYY-MM-DDTHH:mm:ss");
  const endDate = query.get("endDate") || dayjs().endOf('month').format("YYYY-MM-DDTHH:mm:ss") ;
  
  // const updateSuccess = useSelector(updateSuccessSelector);
  // const deleteSuccess = useSelector(deleteSuccessSelector);
  return useMemo(() => {
    const queryParams = {
      page,
      limit,
      keyword,
      startDate,
      endDate,
    };
    return [queryParams];
    //eslint-disable-next-line
  }, [page, limit, keyword,startDate,endDate]);
};

export const useUpdateCostManagementParams = (
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

export const handleChangeVariant = (data: any[],setData: any) => {
  const convert = (productId: any, variantId: any) => {
     const newData = data.map((item) => {
      if (item?._id === productId) {
        return {
          ...item,
          variantCurrent: item?.variants?.find((v: any) => v?._id === variantId),
        };
      };
      return item;
     });
    setData(newData);
  };
  return convert;
};

export const convertReferenceUnitIsPercent = (variant: any, key: any) => {
  return variant[key] <= 0 ? 0 : round(Number((variant[key] / variant?.totalRevenueVariant) * 100), 3);
};
export const convertVariantDefault = (variant: any, key: any) => {
 return ({
   VND: variant[key] || 0,
   PERCENT: Number(convertReferenceUnitIsPercent(variant, key)) || 0,
 });
};
export const convertData = (variant: any) => {
 return {
   logistic: convertVariantDefault(variant, 'logistic'),
   operations: convertVariantDefault(variant, 'operations'),
   marketing: convertVariantDefault(variant, 'marketing'),
   management: convertVariantDefault(variant, 'management'),
   financialCost: convertVariantDefault(variant, 'financialCost'),
   costEmployee: convertVariantDefault(variant, 'costEmployee')
 };
};

export const handleConvertCost = (data: any,setData: any, typeVariant: string) => {
  const handleConvert = (key: any, value: any, variantId: any) => {

    const newData = {
      ...data,
      variants: data?.variants?.map((item: any) => {
        if (item?._id === variantId) {
          return  (typeVariant ?? "VND") === "VND" ? {
            ...item,
            [key]: {
              VND: value,
              PERCENT: round((Number((value / item?.totalRevenueVariant) * 100)), 3),
            }
          } : {
              ...item,
              [key]: {
                PERCENT: value,
                VND: round(Number((value / 100) * item?.totalRevenueVariant), 3),
              }
          }
        };
        return item;
      })
     };
    setData(newData);
  };
  return handleConvert
};

export const convertDataSubmit = (values: any) => {
  console.log(values,'data')
  const data = values?.map((item: any) => ({
    financialCost: item?.financialCost?.VND || 0,
    logistic: item?.logistic.VND || 0,
    management: item?.management.VND || 0,
    marketing: item?.marketing.VND || 0,
    operations: item?.operations.VND || 0, 
    variantId: item?.variantId,
    cosEmployee: item?.cosEmployee || 0,
  }))
  return data
};