import { notification } from "antd";
import { createContext, useContext, useCallback, useState } from "react";
import { ArgsProps } from "antd/es/notification/interface";
import {
  useCreateBenefit,
  useGetReportConfigBenefitData,
  useGetReportConfigBenefitTable,
} from "../benefitConfiguration.hook";
import { TypeBenefit } from "../benefitConfiguration.modal";
// type BenefitConfigType = "success" | "info" | "warning" | "error";
const WIDTH_ITEM = 240;

export type GlobalBenefitConfig = {
  createBenefit: (p: any) => void;
  isSubmitLoading: boolean;
  dataRowCol: any;
  dataConfig: any;
  mutate: () => void;
  isLoading: boolean;
  reFetch: boolean;
  WIDTH_ITEM : number
  typeBenefit : TypeBenefit
};

const BenefitConfig = createContext<GlobalBenefitConfig>({
  createBenefit: () => {},
  isSubmitLoading: false,
  isLoading: false,
  reFetch: false,
  dataRowCol: null,
  dataConfig: null,
  mutate: () => {},
  WIDTH_ITEM : 200,
  typeBenefit : 'BENEFIT_TDV'
});

export function BenefitConfigProvider({
  children,
  typeBenefit,
}: {
  children: any;
  typeBenefit: TypeBenefit;
}): React.JSX.Element {
  const [reFetch, setReFetch] = useState<boolean>(false);
  const [dataRowCol, isLoading] = useGetReportConfigBenefitTable(
    typeBenefit,
    // reFetch
  );
  const [dataConfig, isLoadingDataConfig] = useGetReportConfigBenefitData(
    typeBenefit,
    // reFetch
  );
  const mutate = useCallback(() => setReFetch(!reFetch), [reFetch]);
  const onCallBack = useCallback(() => {
    mutate();
  }, [mutate]);
  const [isSubmitLoading, createBenefit] = useCreateBenefit(onCallBack);

  return (
    <BenefitConfig.Provider
      value={{
        createBenefit,
        isSubmitLoading,
        dataRowCol,
        dataConfig,
        mutate,
        isLoading: isLoading || isLoadingDataConfig,
        WIDTH_ITEM,
        typeBenefit,
        reFetch,
      }}
    >
      {children}
    </BenefitConfig.Provider>
  );
}

const useBenefitConfigStore = (): GlobalBenefitConfig =>
  useContext(BenefitConfig);

export default useBenefitConfigStore;
