import { initStateSlice } from "~/redux/models";

export type propsType = {
  _id?: string;
  deletePharmacy?: (p?: any) => void;
  onOpenForm?: (_id?: string) => void;
  pharmacyId: string | null
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
};

export type DataSourceItemType = {
  name: string;
  code: string;
  phoneNumber: string;
  address: any;
  _id: string;
};