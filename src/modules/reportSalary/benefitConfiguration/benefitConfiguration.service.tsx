import { Button } from "antd";
import { find, get, keys } from "lodash";
import { TypeBenefit } from "./benefitConfiguration.modal";
import CreateKpiExClusiveProduct from "./components/CreateKpiExClusiveProduct";
import ValueShow from "./components/ValueShow";
import {
  GROUP_TYPE_BENEFIT,
  GROUP_TYPE_BENEFIT_BASE,
  GROUP_TYPE_BENEFIT_KPIS,
  GROUP_TYPE_BENEFIT_OVER,
  TYPE_BENEFIT,
  TYPE_KPI,
} from "./constants";

export const service = {};
type ParamsGetColumns = {
  col: any;
  WIDTH_ITEM: number;
  mutate: () => void;
};

export const getColumnsBenefit = ({
  col,
  WIDTH_ITEM,
  mutate,
}: ParamsGetColumns): any => {
  console.log(col, "col");

  return {
    title: get(col, "supplierId.name", ""),
    dataIndex: get(col, "_id"),
    key: get(col, "_id"),
    align: "center",
    width: WIDTH_ITEM,
    render: (value: any, record: any) => {
      return (
        <ValueShow
          conditionId={get(record, "conditionId")}
          benefitId={get(col, "_id")}
          value={value || 0}
          mutate={mutate}
        />
      );
    },
  };
};

export const getColumnsKpis = ({
  col,
  WIDTH_ITEM,
  mutate,
}: ParamsGetColumns) => {

  let children: any[] = [
    {
      title: "Độ phủ thị trường",
      dataIndex: `${TYPE_KPI.COVER_POS}__${get(
        col,
        `${TYPE_KPI.COVER_POS}._id`
      )}`,
      key: `${TYPE_KPI.COVER_POS}__${get(col, `${TYPE_KPI.COVER_POS}._id`)}`,
      width: 120,
      align: "center",
      render: (value: any, record: any) => {
        return (
          <ValueShow
            conditionId={get(record, "conditionId")}
            benefitId={get(col, `${TYPE_KPI.COVER_POS}._id`)}
            value={value || 0}
            mutate={mutate}
          />
        );
      },
    },
  ];

  if (get(col, `${TYPE_KPI.EXCLUSIVE_PRODUCT}`)) {
    // Push Exits
    children.push({
      title: "SP độc quyền",
      dataIndex: `${TYPE_KPI.EXCLUSIVE_PRODUCT}__${get(
        col,
        `${TYPE_KPI.EXCLUSIVE_PRODUCT}._id`
      )}`,
      key: `${TYPE_KPI.EXCLUSIVE_PRODUCT}__${get(
        col,
        `${TYPE_KPI.EXCLUSIVE_PRODUCT}._id`
      )}`,
      width: 120,
      align: "center",
      render: (value: any, record: any) => {
        console.log(record, "record");

        return (
          <ValueShow
            conditionId={get(record, "conditionId")}
            benefitId={get(col, `${TYPE_KPI.EXCLUSIVE_PRODUCT}._id`)}
            value={value || 0}
            mutate={mutate}
          />
        );
      },
    });
  } else {
    // Push Create

    children.push({
      title: (
        <CreateKpiExClusiveProduct
          supplierId={get(col, "supplierId")}
          typeBenefit={get(col, "typeBenefit")}
        />
      ),
      width: 120,
      align: "center",
      render: (value: any, record: any) => <></>,
    });
  };
  return {
    title: get(col, "supplierId.name", ""),
    key: get(col, "_id"),
    width: WIDTH_ITEM,
    children,
  };
};

export const getColumnsBenefitOver = ({
  col,
  WIDTH_ITEM,
  mutate,
}: ParamsGetColumns): any => {

  return {
    title: get(col, "supplierId.name", ""),
    dataIndex: get(col, "_id"),
    key: get(col, "_id"),
    align: "center",
    width: WIDTH_ITEM,
    render: (value: any, record: any) => {
      return (
        <ValueShow
          conditionId={get(record, "conditionId")}
          benefitId={get(col, "_id")}
          value={value || 0}
          mutate={mutate}
        />
      );
    },
  };
};
export const getDataSourceBenefit = ({
  data,
  dataConfig,
}: {
  data: any;
  dataConfig: any;
}) => {
  // Get Col Map To Make DataIndex Columns Table to Show Value
  const dataSource: any[] = get(data, "row", [])?.map((r: any) => {
    const mapCondition = find(
      dataConfig,
      (v: any) => get(v, "condId") === get(r, "_id")
    );
    const { collMap } = mapCondition || {};
    return {
      ...collMap,
      ...r,
      conditionId: get(r, "_id"),
    };
  });
  console.log(dataSource,'dataSource');
  
  return dataSource;
};
export const getDataSourceKpis = ({
  data,
  dataConfig,
}: {
  data: any;
  dataConfig: any;
}) => {
  // Get Col Map To Make DataIndex Columns Table to Show Value
  const dataSource: any[] = get(data, "row", [])?.map((r: any) => {
    const mapCondition = find(
      dataConfig,
      (v: any) => get(v, "condId") === get(r, "_id")
    );
    const { collMap } = mapCondition || {};
    console.log(collMap, "collMap");

    // Join Each Col Map With kpiType EX: kpiType__collMap[e]
    let joinColMap: any = {};
    keys(collMap)?.map((k: any) => {
      const findCol = find(
        get(data, "col", []),
        (c: any) => k === get(c, "_id")
      );
      const kpiType = get(findCol, "kpiType", "");
      joinColMap[`${kpiType}__${k}`] = collMap[k];
    });
    return {
      ...joinColMap,
      ...r,
      conditionId: get(r, "_id"),
    };
  });
  return dataSource;
};
type ParamsActionByType = {
  typeBenefit?: TypeBenefit | null;
  actionKpis: () => void;
  actionBenefit: () => void;
  actionBenefitOver: () => void;
  actionBenefitWorking: () => void;
};
export const actionByType = ({
  typeBenefit,
  actionKpis,
  actionBenefit,
  actionBenefitOver,
  actionBenefitWorking,
}: ParamsActionByType) => {
  if (GROUP_TYPE_BENEFIT_BASE.includes(typeBenefit)) {
    actionBenefit();
    return;
  }
  if (GROUP_TYPE_BENEFIT_KPIS.includes(typeBenefit)) {    
    actionKpis();
    return;
  }
  if (GROUP_TYPE_BENEFIT.includes(typeBenefit)) {
    actionBenefit();
    return;
  }
  if (GROUP_TYPE_BENEFIT_OVER.includes(typeBenefit)) {
    actionBenefitOver();
    return;
  }
  if (TYPE_BENEFIT.BENEFIT_WORKING === typeBenefit) {
    actionBenefitWorking();
    return;
  }
};
type ParamsCreateConditionByType = {
  typeBenefit?: TypeBenefit | null;
  ComponentCreateConditionKpis: any;
  ComponentCreateConditionBenefit: any;
  ComponentCreateConditionBenefitBase: any;
  ComponentCreateConditionOver: any;
  ComponentCreateConditionWorking: any;
};
export const CreateConditionByType = ({
  typeBenefit,
  ComponentCreateConditionKpis,
  ComponentCreateConditionBenefit,
  ComponentCreateConditionOver,
  ComponentCreateConditionWorking,
  ComponentCreateConditionBenefitBase,
}:ParamsCreateConditionByType) : React.JSX.Element => {
  if (GROUP_TYPE_BENEFIT_BASE.includes(typeBenefit)) {
    return ComponentCreateConditionBenefitBase
  }
  if (GROUP_TYPE_BENEFIT.includes(typeBenefit)) {
    return ComponentCreateConditionBenefit
  }
  if (GROUP_TYPE_BENEFIT_KPIS.includes(typeBenefit)) {    
    return ComponentCreateConditionKpis
  }
  if (GROUP_TYPE_BENEFIT_OVER.includes(typeBenefit)) {
    return ComponentCreateConditionOver
  }
  if (TYPE_BENEFIT.BENEFIT_WORKING === typeBenefit) {
    return ComponentCreateConditionWorking
  }
  return <></>
}
type ParamsShowConditionByType = {
  typeBenefit?: TypeBenefit | null;
  ComponentShowConditionKpis: any;
  ComponentShowConditionBenefit: any;
  ComponentShowConditionOver: any;
  ComponentShowConditionWorking: any;
  ComponentShowConditionBenefitBase: any;
};

export const ShowConditionByType = ({
  typeBenefit,
  ComponentShowConditionKpis,
  ComponentShowConditionBenefit,
  ComponentShowConditionOver,
  ComponentShowConditionWorking,
  ComponentShowConditionBenefitBase,
}:ParamsShowConditionByType) : React.JSX.Element => {
  
  if (GROUP_TYPE_BENEFIT_BASE.includes(typeBenefit)) {
    return ComponentShowConditionBenefitBase
  }
  if (GROUP_TYPE_BENEFIT_KPIS.includes(typeBenefit)) {    
    return ComponentShowConditionKpis
  }
  if (GROUP_TYPE_BENEFIT.includes(typeBenefit)) {
    return ComponentShowConditionBenefit
  }
  if (GROUP_TYPE_BENEFIT_OVER.includes(typeBenefit)) {
    return ComponentShowConditionOver
  }
  if (TYPE_BENEFIT.BENEFIT_WORKING === typeBenefit) {
    return ComponentShowConditionWorking
  }
  return <></>
}
