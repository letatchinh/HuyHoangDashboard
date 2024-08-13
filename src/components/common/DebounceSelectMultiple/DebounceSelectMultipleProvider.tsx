import { OptionProps } from "antd/es/select/index";
import { createContext, ReactNode, useContext, useMemo } from "react";
import { useFetchState } from "~/utils/hook";
import pharmacyModule from "~/modules/pharmacy";
import ProductModule from "~/modules/product";
import ProductGroupModule from "~/modules/productGroup";
import { get } from "lodash";
import { DSM_getOptions, DSM_getOptionsProduct } from "./DebounceSelectMultiple.service";
import { PropSearchPharmacyV2 } from "~/modules/pharmacy/pharmacy.modal";
// DSM = Debounce Select Multiple
// interface Value
export type GlobalDebounceSelectMultiple = {
  // DSM_dataSourcePharmacyRoot: OptionProps[];
  // DSM_dataSourcePharmacyRootLoading : boolean;
  // DSM_dataSourcePartnerRoot: OptionProps[];
  // DSM_dataSourcePartnerRootLoading : boolean;
  DSM_setting : {
    dataSource : {
      pharma_profile : OptionProps[],
      partner : OptionProps[],
      product : OptionProps[],
      productGroup : OptionProps[],
    }
  }
};
// Init Value
const DebounceSelectMultiple = createContext<GlobalDebounceSelectMultiple>({
  // DSM_dataSourcePharmacyRoot: [],
  // DSM_dataSourcePharmacyRootLoading : false,
  // DSM_dataSourcePartnerRoot: [],
  // DSM_dataSourcePartnerRootLoading : false,
  DSM_setting : {
    dataSource : {
      partner : [],
      pharma_profile : [],
      product : [],
      productGroup : [],
    }
  }
});

type DebounceSelectMultipleProviderProps = {
  children: ReactNode;
  initValuePharmacy? : string[];
  initValuePartner? : string[];
  initValueProduct? : string;
  usePharmacy? : boolean;
  usePartner? : boolean;
  useProduct? : boolean;
  useProductGroup? : boolean;
};

export function DebounceSelectMultipleProvider({
  children,
  initValuePharmacy,
  initValuePartner,
  initValueProduct,
  usePharmacy = false,
  usePartner = false,
  useProduct = false,
  useProductGroup = false,
}: DebounceSelectMultipleProviderProps): JSX.Element {
    
  const queryPharmacy : PropSearchPharmacyV2 | undefined = useMemo(
    () => initValuePharmacy && ({
      customerType : "pharma_profile",
      keyword: "",
      ...initValuePharmacy && {optionWith : {
        id : initValuePharmacy
      }}
    }),
    [initValuePharmacy]
  );

  const queryPartner : PropSearchPharmacyV2 | undefined = useMemo(
    () => initValuePartner && ({
      customerType : "partner",
      keyword: "",
      ...initValuePartner && {optionWith : {
        id : initValuePartner
      }}
    }),
    [initValuePartner]
  );
  
  const queryProduct : any = useMemo(
    () => {
      const query : any = {
        keyword : "",
        limit: 20,
        isSupplierMaster: true,
      }
      if(initValueProduct){
        query.idsInitOptions = initValueProduct;
      }
      return query
    },
    [initValueProduct]
  );



  const [pharmacies, DSM_dataSourcePharmacyRootLoading] = useFetchState({
    api: pharmacyModule.api.searchV2,
    query : queryPharmacy,
    conditionRun : usePharmacy && !!initValuePharmacy,
    useDocs : false
  });
  const [partners, DSM_dataSourcePartnerRootLoading] = useFetchState({
    api: pharmacyModule.api.searchV2,
    query : queryPartner,
    conditionRun : usePartner && !!initValuePartner,
    useDocs : false
  });
  
  const [products, DSM_dataSourceProductRootLoading] = useFetchState({
    api: ProductModule.api.getAll,
    query : queryProduct,
    conditionRun : useProduct && !!initValueProduct,
    useDocs : false,
    fieldGet : "options"
  });

  const [productsGroup, DSM_dataSourceProductGroupRootLoading] = useFetchState({
    api: ProductGroupModule.api.getAllPublic,
    conditionRun : useProductGroup,
    useDocs : false,
  });
  
  const DSM_dataSourcePharmacyRoot : OptionProps[] = useMemo(
    () => DSM_getOptions(pharmacies),
    [pharmacies]
  );

  const DSM_dataSourcePartnerRoot : OptionProps[] = useMemo(
    () => DSM_getOptions(partners),
    [partners]
  );

  const DSM_dataSourceProductGroupRoot : OptionProps[] = useMemo(
    () => DSM_getOptions(productsGroup),
    [productsGroup]
  );
  const DSM_dataSourceProductRoot : OptionProps[] = useMemo(
    () => products,
    [products]
  );

  const DSM_setting = useMemo(() => ({
    dataSource : {
        pharma_profile : DSM_dataSourcePharmacyRoot,
        partner : DSM_dataSourcePartnerRoot,
        product : DSM_dataSourceProductRoot,
        productGroup : DSM_dataSourceProductGroupRoot,
    },
    loading : {
      pharma_profile : DSM_dataSourcePharmacyRootLoading,
      partner : DSM_dataSourcePartnerRootLoading,
      product : DSM_dataSourceProductRootLoading,
      productGroup : DSM_dataSourceProductGroupRootLoading,
    }
}),[
  DSM_dataSourcePharmacyRoot,
  DSM_dataSourcePartnerRoot,
  DSM_dataSourceProductRoot,
  DSM_dataSourceProductGroupRoot,
])

  return (
    <DebounceSelectMultiple.Provider
      value={{
        // Value
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
