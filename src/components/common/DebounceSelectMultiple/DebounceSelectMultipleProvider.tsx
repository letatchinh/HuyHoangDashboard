import { OptionProps } from "antd/es/select/index";
import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from "react";
import pharmacyModule from "~/modules/pharmacy";
import { PropSearchPharmacyV2 } from "~/modules/pharmacy/pharmacy.modal";
import ProductModule from "~/modules/product";
import ProductGroupModule from "~/modules/productGroup";
import { useFetchState } from "~/utils/hook";
import { DSM_getOptions } from "./DebounceSelectMultiple.service";
// DSM = Debounce Select Multiple
// interface Value
export type GlobalDebounceSelectMultiple = {
  DSM_setting : {
    dataSource : {
      pharma_profile : OptionProps[],
      partner : OptionProps[],
      product : OptionProps[],
      productGroup : OptionProps[],
    },
    values : {
      pharma_profile : string[],
      partner : string[],
      product : string[],
      productGroup : string[],
    },
    loading : {
      pharma_profile : boolean,
      partner : boolean,
      product : boolean,
      productGroup : boolean,
    },
  }
};
// Init Value
const DebounceSelectMultiple = createContext<GlobalDebounceSelectMultiple>({
  DSM_setting : {
    dataSource : {
      partner : [],
      pharma_profile : [],
      product : [],
      productGroup : [],
    },
    values : {
      pharma_profile : [],
      partner : [],
      product : [],
      productGroup : [],
    },
    loading : {
      pharma_profile : false,
      partner : false,
      product : false,
      productGroup : false,
    },
  }
});

type DebounceSelectMultipleProviderProps = {
  children: ReactNode;
  valuesPharmacy? : string[];
  valuesPartner? : string[];
  valuesProduct? : string[]; 
  valuesProductGroup? : string[]; 
  usePharmacy? : boolean;
  usePartner? : boolean;
  useProduct? : boolean;
  useProductGroup? : boolean;
};

export function DebounceSelectMultipleProvider({
  children,
  valuesPharmacy,
  valuesPartner,
  valuesProduct,
  valuesProductGroup,
  usePharmacy = false,
  usePartner = false,
  useProduct = false,
  useProductGroup = false,
}: DebounceSelectMultipleProviderProps): JSX.Element {

  const [dataIsReady, setDataIsReady] = useState({ // Check Data is Exists Will Not Call Api Again
    pharma_profile: false,
    partner: false,
    product: false,
    productGroup: false,
  });
  
  const queryPharmacy : PropSearchPharmacyV2 | undefined = useMemo(
    () => valuesPharmacy && ({
      customerType : "pharma_profile",
      keyword: "",
      ...valuesPharmacy && {optionWith : {
        id : valuesPharmacy
      }}
    }),
    [valuesPharmacy]
  );

  const queryPartner : PropSearchPharmacyV2 | undefined = useMemo(
    () => valuesPartner && ({
      customerType : "partner",
      keyword: "",
      ...valuesPartner && {optionWith : {
        id : valuesPartner
      }}
    }),
    [valuesPartner]
  );
  
  const queryProduct : any = useMemo(
    () => {
      const query : any = {
        keyword : "",
        limit: 20,
        isSupplierMaster: true,
      }
      if(valuesProduct){
        query.idsInitOptions = valuesProduct?.join(',');
      }
      return query
    },
    [valuesProduct]
  );



  const [pharmacies, DSM_dataSourcePharmacyRootLoading] = useFetchState({
    api: pharmacyModule.api.searchV2,
    query : queryPharmacy,
    conditionRun : usePharmacy && !!valuesPharmacy && !dataIsReady.pharma_profile,
    useDocs : false
  });
  const [partners, DSM_dataSourcePartnerRootLoading] = useFetchState({
    api: pharmacyModule.api.searchV2,
    query : queryPartner,
    conditionRun : usePartner && !!valuesPartner && !dataIsReady.partner,
    useDocs : false
  });
  
  const [products, DSM_dataSourceProductRootLoading] = useFetchState({
    api: ProductModule.api.getAll,
    query : queryProduct,
    conditionRun : useProduct && !!valuesProduct && !dataIsReady.product,
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

  const DSM_setting = useMemo(
    () => ({
      dataSource: {
        pharma_profile: DSM_dataSourcePharmacyRoot,
        partner: DSM_dataSourcePartnerRoot,
        product: DSM_dataSourceProductRoot,
        productGroup: DSM_dataSourceProductGroupRoot,
      },
      loading: {
        pharma_profile: DSM_dataSourcePharmacyRootLoading,
        partner: DSM_dataSourcePartnerRootLoading,
        product: DSM_dataSourceProductRootLoading,
        productGroup: DSM_dataSourceProductGroupRootLoading,
      },
      values: {
        pharma_profile: valuesPharmacy || [],
        partner: valuesPartner || [],
        product: valuesProduct || [],
        productGroup: valuesProductGroup || [],
      },
    }),
    [
      DSM_dataSourcePharmacyRoot,
      DSM_dataSourcePartnerRoot,
      DSM_dataSourceProductRoot,
      DSM_dataSourceProductGroupRoot,
      valuesPharmacy,
      valuesPartner,
      valuesProduct,
      valuesProductGroup,
      DSM_dataSourcePharmacyRootLoading,
      DSM_dataSourcePartnerRootLoading,
      DSM_dataSourceProductRootLoading,
      DSM_dataSourceProductGroupRootLoading,
    ]
  );

  useEffect(() => {
    setDataIsReady({
      pharma_profile : !!DSM_dataSourcePharmacyRoot?.length,
      partner : !!DSM_dataSourcePartnerRoot?.length,
      product : !!DSM_dataSourceProductRoot?.length,
      productGroup : !!DSM_dataSourceProductGroupRoot?.length,
    })
  },[DSM_setting])
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
