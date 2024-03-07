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

    isLoadingGetRevenueSupplier?: boolean;
    getRevenueSupplierFailed?: any;
    revenueSupplier?: any;
    pagingRevenueSupplier?: any;

    isLoadingGetTotalRevenue?: boolean;
    totalRevenue?: any;
    getTotalRevenueFailed?: any;

    updateRevenueSuccess?: any;
    updateRevenueFailed?: any;

    createTotalRevenueSuccess?: any;
    createTotalRevenueFailed?: any;

    updateTotalRevenueSuccess?: any;
    updateTotalRevenueFailed?: any;

    isLoadingGetListTotalRevenue?: boolean;
    getListTotalRevenueFailed?: any;
    revenueListTotal?: T[];
    pagingListTotalRevenue?: any;

    isLoadingGetListProductGroupRevenue ?: boolean;
    productGroupRevenue?: any;
    getProductGroupsRevenueFailed?: any;

    updateRevenueProductGroupsSuccess?: any;
    updateRevenueProductGroupsFailed?: any;
    
    pagingListProductGroupRevenue ?: any;
    revenueId?: any;
    isLoadingSubmitRevenue?: boolean;
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

export const STATUS_SUPPLIER_TYPE_VI : any= {
  ACTIVE: "Hoạt động",
  INACTIVE: "Ngưng hoạt động",
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

export const PROVIDER_COLLECTION_CONTRACT_MINERAL = {
  pharma_profile: 'pharma_profile',
  supplier: 'supplier',
  TDV: 'TDV',
};
