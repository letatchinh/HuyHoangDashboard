import { Button } from "antd";
import React, { useCallback } from "react";
import { useCreateBenefit } from "../benefitConfiguration.hook";
import { TypeBenefit } from "../benefitConfiguration.modal";
import { TYPE_KPI } from "../constants";
import useBenefitConfigStore from "../store/BenefitConfigContext";
type propsType = {
  supplierId : any,
  typeBenefit? : TypeBenefit | null
};
export default function CreateKpiExClusiveProduct({
  supplierId,
  typeBenefit,
}: propsType): React.JSX.Element {
  const {createBenefit,isSubmitLoading} = useBenefitConfigStore();
  const onCreateBenefit = useCallback(() => {
    createBenefit({
      supplierId,
      typeBenefit,
      kpiType: TYPE_KPI.EXCLUSIVE_PRODUCT, // Default TYPE_KPI.EXCLUSIVE_PRODUCT
    });
  }, [typeBenefit,supplierId,createBenefit]);

  return (
    <Button loading={isSubmitLoading} onClick={onCreateBenefit} size="small" type="dashed">
      + SP độc quyền
    </Button>
  );
}
