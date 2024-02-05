import { initStateSlice } from "~/redux/models";
import { cumulativeDiscountType } from "../cumulativeDiscount/cumulativeDiscount.modal";
export type propsTypeFormSupplier = {
  id? : any,
  onCancel : () => void,
  onUpdate : (p:any) => void,
  isSubmitLoading : boolean,
}
export type propsTypeTabSupplier = {
    id? : any,
    onCancel : () => void,
    onUpdate : (p:any) => void,
    isSubmitLoading : boolean,

}
export type addressType = {
    cityId: string;
    districtId: string;
    wardId: string;
    street: string;
  };
  export type FieldType = {
    name: string;
    phoneNumber: string;
    address: addressType;
    cumulativeDiscount : cumulativeDiscountType[]
  };


  export interface cloneInitState<T = any> extends initStateSlice {
    isLoadingGetProductSupplier?: boolean;
    getProductSupplierFailed?: any;
    productSupplier?: T[];
    pagingProductSupplier?: any;
    isLoadingGetSuppliersProductAuthor?: boolean;
    getSuppliersProductAuthorFailed?: any;
    suppliersProductAuthor?: T[];
    pagingSuppliersProductAuthor?: any;
  }

  export type STATUS_SUPPLIER_TYPE =  {
    ACTIVE : "ACTIVE",
    INACTIVE : "INACTIVE",
  }