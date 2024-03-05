import { initStateSlice } from "~/redux/models";

export type propsType = {
  _id?: string;
  deletePharmacy?: (p?: any) => void;
  onOpenForm?: (_id?: string) => void;
  pharmacyId: string | null
};

export type propsAccumulation = {
  _id?: string;
  pharmacyId: string | null;
  targetType: 'GROUP' | 'PRODUCT',
}
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

};
