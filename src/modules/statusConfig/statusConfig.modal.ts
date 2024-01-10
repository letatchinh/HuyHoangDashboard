import { initStateSlice } from "~/redux/models";

export interface cloneInitState<T = any> extends initStateSlice {
    isLoadingGetStatusConfig?: boolean;
    getStatusConfigFailed?: any;
    statusConfig?: T[];
    pagingStatusConfig?: any;
  }

 export interface DataTypeStatusConfig {
    key?: React.Key;
    _id?: string;
    value?: string;
    color?: string;
    justAdmin?: boolean;
    backgroundColor?: string;
    priority?: boolean;
    isDefault?: boolean;
  }