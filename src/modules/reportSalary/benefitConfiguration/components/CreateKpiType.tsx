import { Button } from "antd";
import React, { useCallback } from "react";
import { TypeBenefit, TypeKpi } from "../benefitConfiguration.modal";
import { TYPE_KPI_VI } from "../constants";
import useBenefitConfigStore from "../store/BenefitConfigContext";
type propsType = {
  supplierId : any,
  typeBenefit? : TypeBenefit | null,
  kpiType : TypeKpi
};
export default function CreateKpiType({
  supplierId,
  typeBenefit,
  kpiType,
}: propsType): React.JSX.Element {
  const {createBenefit,isSubmitLoading} = useBenefitConfigStore();
  const onCreateBenefit = useCallback(() => {
    createBenefit({
      supplierId,
      typeBenefit,
      kpiType,
    });
  }, [typeBenefit,supplierId,createBenefit]);

  return (
    <Button loading={isSubmitLoading} onClick={onCreateBenefit} size="small" type="dashed">
      + {TYPE_KPI_VI[kpiType]}
    </Button>
  );
}
