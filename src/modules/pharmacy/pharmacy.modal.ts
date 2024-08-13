import { initStateSlice } from "~/redux/models";

export type propsType = {
  _id?: string;
  deletePharmacy?: (p?: any) => void;
  onOpenForm?: (_id?: string) => void;
  pharmacyId: string | null
  onParamChange?: (p?: any) => void;
};

export type propsAccumulation = {
  _id?: string;
  pharmacyId: string | null;
  targetType: 'GROUP' | 'PRODUCT',
}
export type propsAccumulationDetail = {
  _id?: string;
  pharmacyId: string | null;
  targetType: 'GROUP' | 'PRODUCT',
  date?: any,
};
export interface cloneInitState<T = any> extends initStateSlice {
  isLoadingGetPharmacyDebt?: boolean;
  getPharmacyDebtFailed?: any;
  pharmacyDebt?: T[];
  pagingPharmacyDebt?: any;

  isLoadingGetHistoryPharmacy?: boolean;
  getHistoryPharmacyFailed?: any;
  historyPharmacy?: T[];
  pagingHistoryPharmacy?: any;

  isLoadingGetAccumulation?: false;
  getAccumulationFailed?: null;
  accumulation?: T[];
  pagingAccumulation?: any;

  isLoadingGetAccumulationDetail?: false;
  getAccumulationDetailFailed?: null;
  accumulationDetail?: T[];
  pagingAccumulationDetail?: any;

  convertSuccess?: any;
  convertFailed?: any;

};
export type SearchByType = "date" | "month" | "quarter" | "year"
export type FormFieldSearch = {
  startDate?: any,
  endDate?: any,
  searchBy?: SearchByType,
};

export type DataSourceItemType = {
  name: string;
  code: string;
  phoneNumber: string;
  address: any;
  _id: string;
};

export type PROCESS_STATUS_TYPE = {
  APPROVED: string;
  NEW: string;
  CANCELED: string;
};

export const PROCESS_STATUS : PROCESS_STATUS_TYPE= {
  APPROVED: 'APPROVED',
  NEW: 'NEW',
  CANCELED: 'CANCELED',
}
export const PROCESS_STATUS_VI : any = {
  APPROVED: 'Đã duyệt',
  NEW: 'Đang chờ duyệt',
  CANCELED: 'Đã huỷ',
};
export const PROCESS_STATUS_VI_COLOR : any = {
  APPROVED: '#8ce312',
  NEW: '#B3C8CF',
  CANCELED: '#ff4141',
};

export interface PropSearchPharmacy {
  type? : "pharmacy" | "ctv" | null,
  keyword? : string,
  id? : any,
  optionWith? : {
    id : any[]
  },
}
export interface PropSearchPharmacyV2 {
  customerType? : "pharma_profile" | "partner" | null,
  keyword? : string,
  optionWith? : {
    id : any[]
  },
}