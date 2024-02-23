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

    isLoadingGetVoucherSupplier?: boolean;
    getVoucherSupplierFailed?: any;
    voucherSupplier?: T[];
    pagingVoucherSupplier?: any;
    totalAmountOrder?: number;
    isLoadingGetSuppliersProductAuthor?: boolean;
    getSuppliersProductAuthorFailed?: any;
    suppliersProductAuthor?: T[];
    pagingSuppliersProductAuthor?: any;
};


export type SearchByType = "date" | "month" | "quarter" | "year";
export type FormFieldSearch = {
  startDate?: any,
  endDate?: any,
  searchBy?: SearchByType,
};
export type STATUS_SUPPLIER_TYPE = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};
export type STATUS_BILL_TYPE = {
  NEW: "NEW",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};
export type STATUS_BILL_VI_TYPE = {
  NEW: "Đã tiếp nhận",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã huỷ",
};
