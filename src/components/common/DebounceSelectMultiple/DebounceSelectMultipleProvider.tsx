import { OptionProps } from "antd/es/select/index";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { useFetchState } from "~/utils/hook";
import pharmacyModule from "~/modules/pharmacy";
import { get } from "lodash";
import { DSM_getOptions } from "./DebounceSelectMultiple.service";
import { PropSearchPharmacy } from "~/modules/pharmacy/pharmacy.modal";
// DSM = Debounce Select Multiple
// interface Value
export type GlobalDebounceSelectMultiple = {
  DSM_dataSourcePharmacyRoot: OptionProps[];
  DSM_dataSourcePharmacyRootLoading : boolean;
  DSM_dataSourcePartnerRoot: OptionProps[];
  DSM_dataSourcePartnerRootLoading : boolean;
  DSM_setting : {
    dataSource : {
      pharma_profile : OptionProps[],
      partner : OptionProps[]
    }
  }
};
// Init Value
const DebounceSelectMultiple = createContext<GlobalDebounceSelectMultiple>({
  DSM_dataSourcePharmacyRoot: [],
  DSM_dataSourcePharmacyRootLoading : false,
  DSM_dataSourcePartnerRoot: [],
  DSM_dataSourcePartnerRootLoading : false,
  DSM_setting : {
    dataSource : {
      partner : [],
      pharma_profile : []
    }
  }
});

type DebounceSelectMultipleProviderProps = {
  children: ReactNode;
  initValuePharmacy : string[];
  initValuePartner : string[];
  usePharmacy? : boolean
  usePartner? : boolean
};

export function DebounceSelectMultipleProvider({
  children,
  initValuePharmacy,
  initValuePartner,
  usePharmacy = true,
  usePartner = true,
}: DebounceSelectMultipleProviderProps): JSX.Element {
    
  const queryPharmacy : PropSearchPharmacy = useMemo(
    () => initValuePharmacy && ({
      type : "pharmacy",
      keyword: "",
      ...initValuePharmacy && {optionWith : {
        id : initValuePharmacy
      }}
    }),
    [initValuePharmacy]
  );

  const queryPartner : PropSearchPharmacy = useMemo(
    () => initValuePartner && ({
      type : "ctv",
      keyword: "",
      ...initValuePartner && {optionWith : {
        id : initValuePartner
      }}
    }),
    [initValuePartner]
  );


  const [pharmacies, DSM_dataSourcePharmacyRootLoading] = useFetchState({
    api: pharmacyModule.api.search,
    query : queryPharmacy,
    conditionRun : usePharmacy && !!initValuePharmacy,
  });
  const [partners, DSM_dataSourcePartnerRootLoading] = useFetchState({
    api: pharmacyModule.api.search,
    query : queryPartner,
    conditionRun : usePartner && !!initValuePartner,
  });
  
  const DSM_dataSourcePharmacyRoot : OptionProps[] = useMemo(
    () => DSM_getOptions(pharmacies),
    [pharmacies]
  );

  const DSM_dataSourcePartnerRoot : OptionProps[] = useMemo(
    () => DSM_getOptions(partners),
    [partners]
  );

  const DSM_setting = useMemo(() => ({
    dataSource : {
        pharma_profile : DSM_dataSourcePharmacyRoot,
        partner : DSM_dataSourcePartnerRoot
    }
}),[
  DSM_dataSourcePharmacyRoot,
  DSM_dataSourcePartnerRoot,
])

  return (
    <DebounceSelectMultiple.Provider
      value={{
        // Value
        DSM_dataSourcePharmacyRoot,
        DSM_dataSourcePharmacyRootLoading,
        DSM_dataSourcePartnerRoot,
        DSM_dataSourcePartnerRootLoading,
        DSM_setting,
      }}
    >
      {children}
    </DebounceSelectMultiple.Provider>
  );
}

const useDebounceSelectMultipleStore = (): GlobalDebounceSelectMultiple =>
  useContext(DebounceSelectMultiple);

export default useDebounceSelectMultipleStore;
