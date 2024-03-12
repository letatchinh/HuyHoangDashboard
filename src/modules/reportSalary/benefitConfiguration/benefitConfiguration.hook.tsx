import { find, get, groupBy, keys, omit } from "lodash";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { clearQuerySearch, getExistProp } from "~/utils/helpers";
import {
  getSelectors,
  useFailed,
  useFetchByParam,
  useQueryParams,
  useResetState,
  useSubmit,
  useSuccess,
} from "~/utils/hook";
import { TypeBenefit } from "./benefitConfiguration.modal";
import {
  actionByType,
  getColumnsBenefit,
  getColumnsBenefitOver,
  getColumnsKpis,
  getDataSourceBenefit,
  getDataSourceKpis,
  ShowConditionByType,
} from "./benefitConfiguration.service";
import ConditionOver from "./components/ConditionOver";
import ConditionShow from "./components/ConditionShow";
import ConditionShowBenefitBase from "./components/ConditionShowBenefitBase";
import ConditionShowWorking from "./components/ConditionShowWorking";
import SelectSupplierNotExist from "./components/SelectSupplierNotExist";
import { GROUP_TYPE_BENEFIT_OVER, TYPE_KPI } from "./constants";
import { benefitConfigurationActions } from "./redux/reducer";
import useBenefitConfigStore from "./store/BenefitConfigContext";
const MODULE = "benefitConfiguration";
const MODULE_VI = "";
const getSelector = (key: any) => (state: any) => state[MODULE][key];

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
const reportConfigBenefitTableSelector = getSelector(
  "reportConfigBenefitTable"
);
const isReportConfigBenefitTableLoadingSelector = getSelector(
  "isReportConfigBenefitTableLoading"
);
const reportConfigBenefitTableFailedSelector = getSelector(
  "reportConfigBenefitTableFailed"
);

const reportConfigBenefitDataSelector = getSelector("reportConfigBenefitData");
const isReportConfigBenefitDataLoadingSelector = getSelector(
  "isReportConfigBenefitDataLoading"
);
const reportConfigBenefitDataFailedSelector = getSelector(
  "reportConfigBenefitDataFailed"
);

const createConditionSuccessSelector = getSelector("createConditionSuccess");
const createConditionFailedSelector = getSelector("createConditionFailed");
const updateConditionSuccessSelector = getSelector("updateConditionSuccess");
const updateConditionFailedSelector = getSelector("updateConditionFailed");
const deleteConditionSuccessSelector = getSelector("deleteConditionSuccess");
const deleteConditionFailedSelector = getSelector("deleteConditionFailed");

const createBenefitSuccessSelector = getSelector("createBenefitSuccess");
const createBenefitFailedSelector = getSelector("createBenefitFailed");
const deleteBenefitSuccessSelector = getSelector("deleteBenefitSuccess");
const deleteBenefitFailedSelector = getSelector("deleteBenefitFailed");

const createConfigSuccessSelector = getSelector("createConfigSuccess");
const createConfigFailedSelector = getSelector("createConfigFailed");
const updateConfigSuccessSelector = getSelector("updateConfigSuccess");
const updateConfigFailedSelector = getSelector("updateConfigFailed");

export const useBenefitConfigurationPaging = () => useSelector(pagingSelector);

export const useGetBenefitConfigurations = (param: any) => {
  return useFetchByParam({
    action: benefitConfigurationActions.getListRequest,
    loadingSelector: loadingSelector,
    dataSelector: listSelector,
    failedSelector: getListFailedSelector,
    param,
  });
};
export const useGetBenefitConfiguration = (id: any) => {
  return useFetchByParam({
    action: benefitConfigurationActions.getByIdRequest,
    loadingSelector: getByIdLoadingSelector,
    dataSelector: getByIdSelector,
    failedSelector: getByIdFailedSelector,
    param: id,
  });
};

export const useGetReportConfigBenefitTable = (
  typeBenefit?: TypeBenefit | null
  // reFetch?: boolean
) => {
  const createBenefitSuccess = useSelector(createBenefitSuccessSelector);
  const deleteBenefitSuccess = useSelector(deleteBenefitSuccessSelector);
  const createConditionSuccess = useSelector(createConditionSuccessSelector);
  const updateConditionSuccess = useSelector(updateConditionSuccessSelector);
  const deleteConditionSuccess = useSelector(deleteConditionSuccessSelector);
  const createConfigSuccess = useSelector(createConfigSuccessSelector);
  const updateConfigSuccess = useSelector(updateConfigSuccessSelector);
  const [reFetch, setReFetch] = useState(false);
  useEffect(() => {
    setReFetch(!reFetch);
  }, [
    createBenefitSuccess,
    deleteBenefitSuccess,
    createConditionSuccess,
    updateConditionSuccess,
    deleteConditionSuccess,
    createConfigSuccess,
    updateConfigSuccess,
  ]);
  return useFetchByParam({
    action: benefitConfigurationActions.GetReportConfigBenefitTableRequest,
    loadingSelector: isReportConfigBenefitTableLoadingSelector,
    dataSelector: reportConfigBenefitTableSelector,
    failedSelector: reportConfigBenefitTableFailedSelector,
    param: typeBenefit,
    reFetch,
  });
};

export const useGetReportConfigBenefitData = (
  typeBenefit?: TypeBenefit | null,
  // reFetch?: boolean
) => {
  const createBenefitSuccess = useSelector(createBenefitSuccessSelector);
  const deleteBenefitSuccess = useSelector(deleteBenefitSuccessSelector);
  const createConditionSuccess = useSelector(createConditionSuccessSelector);
  const updateConditionSuccess = useSelector(updateConditionSuccessSelector);
  const deleteConditionSuccess = useSelector(deleteConditionSuccessSelector);
  const createConfigSuccess = useSelector(createConfigSuccessSelector);
  const updateConfigSuccess = useSelector(updateConfigSuccessSelector);
  const [reFetch, setReFetch] = useState(false);
  useEffect(() => {
    setReFetch(!reFetch);
  }, [
    createBenefitSuccess,
    deleteBenefitSuccess,
    createConditionSuccess,
    updateConditionSuccess,
    deleteConditionSuccess,
    createConfigSuccess,
    updateConfigSuccess,
  ]);
  return useFetchByParam({
    action: benefitConfigurationActions.GetReportConfigBenefitDataRequest,
    loadingSelector: isReportConfigBenefitDataLoadingSelector,
    dataSelector: reportConfigBenefitDataSelector,
    failedSelector: reportConfigBenefitDataFailedSelector,
    param: typeBenefit,
    reFetch,
  });
};

export const useCreateBenefitConfiguration = (callback?: any) => {
  useSuccess(
    createSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createFailedSelector);

  return useSubmit({
    action: benefitConfigurationActions.createRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useCreateCondition = (callback?: any) => {
  useSuccess(
    createConditionSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createConditionFailedSelector);

  return useSubmit({
    action: benefitConfigurationActions.createConditionRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateCondition = (callback?: any) => {
  useSuccess(
    updateConditionSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`
    // callback
  );
  useFailed(updateConditionFailedSelector);

  return useSubmit({
    action: benefitConfigurationActions.updateConditionRequest,
    loadingSelector: isSubmitLoadingSelector,
    callbackSubmit: callback,
  });
};

export const useDeleteCondition = (callback?: any) => {
  useSuccess(
    deleteConditionSuccessSelector,
    `Xoá ${MODULE_VI} thành công`
    // callback
  );
  useFailed(deleteConditionFailedSelector);

  return useSubmit({
    action: benefitConfigurationActions.deleteConditionRequest,
    loadingSelector: isSubmitLoadingSelector,
    callbackSubmit: callback,
  });
};

export const useCreateBenefit = (callback?: any) => {
  useSuccess(
    createBenefitSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`
    // callback
  );
  useFailed(createBenefitFailedSelector);

  return useSubmit({
    action: benefitConfigurationActions.createBenefitRequest,
    loadingSelector: isSubmitLoadingSelector,
    callbackSubmit: callback,
  });
};

export const useDeleteBenefit = (callback?: any) => {
  useSuccess(
    deleteBenefitSuccessSelector,
    `Gỡ ${MODULE_VI} thành công`
    // callback
  );
  useFailed(deleteBenefitFailedSelector);

  return useSubmit({
    action: benefitConfigurationActions.deleteBenefitRequest,
    loadingSelector: isSubmitLoadingSelector,
    callbackSubmit: callback,
  });
};

export const useCreateConfig = (callback?: any) => {
  useSuccess(
    createConfigSuccessSelector,
    `Tạo mới ${MODULE_VI} thành công`,
    callback
  );
  useFailed(createConfigFailedSelector);

  return useSubmit({
    action: benefitConfigurationActions.createConfigRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useUpdateConfig = (callback?: any) => {
  useSuccess(
    updateConfigSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`
    // callback
  );
  useFailed(updateConfigFailedSelector);

  return useSubmit({
    action: benefitConfigurationActions.updateConfigRequest,
    loadingSelector: isSubmitLoadingSelector,
    callbackSubmit: callback,
  });
};

export const useUpdateBenefitConfiguration = (callback?: any) => {
  useSuccess(
    updateSuccessSelector,
    `Cập nhật ${MODULE_VI} thành công`,
    callback
  );
  useFailed(updateFailedSelector);

  return useSubmit({
    action: benefitConfigurationActions.updateRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useDeleteBenefitConfiguration = (callback?: any) => {
  useSuccess(deleteSuccessSelector, `Xoá ${MODULE_VI} thành công`, callback);
  useFailed(deleteFailedSelector);

  return useSubmit({
    action: benefitConfigurationActions.deleteRequest,
    loadingSelector: isSubmitLoadingSelector,
  });
};

export const useBenefitConfigurationQueryParams = () => {
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

export const useUpdateBenefitConfigurationParams = (
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
    }

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

export const useResetAction = () => {
  return useResetState(benefitConfigurationActions.resetAction);
};

export const useGetColumns = () => {
  const {
    mutate,
    typeBenefit,
    WIDTH_ITEM,
    dataRowCol: data,
    reFetch,
  } = useBenefitConfigStore();
  const columns = useMemo(() => {
    const columnsCondition = {
      title: "Điều kiện",
      dataIndex: "cond",
      key: "cond",
      width: 180,
      align: "center",
      fixed: "left",
      render: (cond: any, rc: any) => (
        <ShowConditionByType
            typeBenefit={typeBenefit}
            ComponentShowConditionBenefitBase={<ConditionShowBenefitBase id={get(rc,'_id')}/>}
            ComponentShowConditionBenefit={<ConditionShow
                cond={cond}
                mutate={mutate}
                rc={rc}
                typeBenefit={typeBenefit}
              />}
            ComponentShowConditionKpis={<ConditionShow
              cond={cond}
              mutate={mutate}
              rc={rc}
              typeBenefit={typeBenefit}
            />}
            ComponentShowConditionOver={<ConditionOver cond={cond} id={get(rc,'_id')}/>}
            ComponentShowConditionWorking={<ConditionShowWorking rc={rc}/>}
          />
        // GROUP_TYPE_BENEFIT_OVER.includes(typeBenefit) 
        // ?
        // <ConditionOver cond={cond} id={get(rc,'_id')}/>
        // : <ConditionShow
        //   cond={cond}
        //   mutate={mutate}
        //   rc={rc}
        //   typeBenefit={typeBenefit}
        // />
      ),
    };
    // Change Value Cols
    let cols: any[] = [];
    actionByType({
      typeBenefit,
      actionBenefit: () => {
        cols = get(data, "col", []);
      },
      actionBenefitOver: () => {
        cols = get(data, "col", []);
      },
      actionKpis: () => {
        const groupBySupplierId = groupBy(get(data, "col", []), (e) =>
          get(e, "supplierId._id")
        );
        let colsTemp = [];
        for (const [key, value] of Object.entries(groupBySupplierId)) {
          let objTemp: any = {};
          value?.forEach((v: any) => {
            objTemp[get(v, "kpiType")] = { ...v };
          });
          colsTemp.push({
            ...(omit(value?.[0], ["kpiType"]) || {}),
            ...objTemp,
          });
        }
        cols = colsTemp;
      },
      actionBenefitWorking: () => {
        cols = get(data, "col", []);
      },
    });
        // get Columns Table

    const columnsRender: any[] = cols?.map((c: any) => {
      let column: any = [];
      actionByType({
        typeBenefit,
        actionBenefit: () => {
          column = getColumnsBenefit({ col: c, mutate, WIDTH_ITEM });
        },
        actionKpis: () => {
          column = getColumnsKpis({ col: c, mutate, WIDTH_ITEM });
        },
        actionBenefitOver: () => {
          column = getColumnsBenefitOver({ col: c, mutate, WIDTH_ITEM });
        },
        actionBenefitWorking: () => {
          column = getColumnsBenefit({ col: c, mutate, WIDTH_ITEM });
        },
      });
      return column;
    });
    
    const columnsAction = {
      title: <SelectSupplierNotExist />,
      width: 100,
      align: "center",
      fixed: "right",
      render: () => <></>,
    };
    if (columnsRender?.length) {
      return [columnsCondition, ...columnsRender, columnsAction];
    } else {
      return [
        columnsCondition,
        columnsAction,
        {
          title: "",
          width: "auto",
          align: "center",
          fixed: "right",
          render: () => <></>,
        },
      ];
    }
  }, [data, reFetch]);
  return columns;
};

export const useGetDataSource = () => {
  const { typeBenefit, dataConfig, dataRowCol: data } = useBenefitConfigStore();
  let dataSource: any[] = [];
  actionByType({
    typeBenefit,
    actionBenefit: () => {
      dataSource = getDataSourceBenefit({ data, dataConfig });
    },
    actionBenefitOver: () => {
      dataSource = getDataSourceBenefit({ data, dataConfig });
    },
    actionKpis: () => {
      dataSource = getDataSourceKpis({ data, dataConfig });
    },
    actionBenefitWorking: () => {
      dataSource = getDataSourceBenefit({ data, dataConfig });
    },
  });
  return dataSource;
};
