import { createSlice } from "@reduxjs/toolkit";
import { get ,omit} from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
import { getPaging } from "~/utils/helpers";
import { cloneInitState } from "../pharmacy.modal";

// InstanceModuleRedux
class PharmacyExtendModule extends InstanceModuleRedux {
  clone;
  cloneInitState: cloneInitState;
  constructor() {
    super("pharmacy");
    this.clone= {
      ...this.initReducer,

      getPharmacyDebtRequest: (state: any) => {
        state.isLoadingGetPharmacyDebt = true;
        state.getPharmacyDebtFailed = null;
        // state.totalAmountBillItem = 0;
      },
      getPharmacyDebtSuccess: (state: any, { payload }: any) => {
        state.isLoadingGetPharmacyDebt = false;
        state.pharmacyDebt = get(payload, "docs", []);
        state.pagingPharmacyDebt = getPaging(payload);
        // state.totalAmountBillItem = get(payload, "totalAmountBillItem", 0);
      },
      getPharmacyDebtFailed: (state: any, { payload }: any) => {
        state.isLoadingGetPharmacyDebt = false;
        state.getPharmacyDebtFailed = payload;
        state.totalAmountBillItem = 0;
      },
      getHistoryPharmacyRequest: (state: any) => {
        state.isLoadingGetHistoryPharmacy = true;
        state.getHistoryPharmacyFailed = null;
      },
      getHistoryPharmacySuccess: (state: any, { payload }: any) => {
        state.isLoadingGetHistoryPharmacy = false;
        state.historyPharmacy = get(payload, "docs", []);
        state.pagingHistoryPharmacy = getPaging(payload);
      },
      getHistoryPharmacyFailed: (state: any, { payload }: any) => {
        state.isLoadingGetHistoryPharmacy = false;
        state.getHistoryPharmacyFailed = payload;
      },
      getAccumulationRequest: (state: any) => {
        state.isLoadingGetAccumulation = true;
        state.getAccumulationFailed = null;
      },
      getAccumulationSuccess: (state: any, { payload }: any) => {
        state.isLoadingGetAccumulation = false;
        state.accumulation = get(payload, "docs", []);
        state.pagingAccumulation = getPaging(payload);
      },
      getAccumulationFailed: (state: any, { payload }: any) => {
        state.isLoadingGetAccumulation = false;
        state.getAccumulationFailed = payload;
        // state.totalAmountBillItem = 0;
      },
      getAccumulationDetailRequest: (state: any) => {
        state.isLoadingGetAccumulationDetail = true;
        state.getAccumulationDetailFailed = null;
      },
      getAccumulationDetailSuccess: (state: any, { payload }: any) => {
        state.isLoadingGetAccumulationDetail = false;
        state.accumulationDetail = payload;
        state.pagingAccumulationDetail = getPaging(payload);
      },
      getAccumulationDetailFailed: (state: any, { payload }: any) => {
        state.isLoadingGetAccumulationDetail = false;
        state.getAccumulationDetailFailed = payload;
      },
      convertRequest: (state: cloneInitState) => {
        state.isSubmitLoading =  true;
      },
      convertSuccess: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading =  false;
        state.convertSuccess = payload;
        state.list = state.list?.map((item: any) => {
          if (get(item, "_id") === get(payload, "_id")) {
            return payload;
          }
          return item;
        })
      },
      updateSuccess: (state:initStateSlice, { payload }:{payload:any}) => {
        state.isSubmitLoading = false;
        const newPayload = payload?.data;
        state.byId = newPayload;
        state.list = state.list?.map((item:any) => get(item,'_id') === get(newPayload,'_id') ? newPayload : item);
        state.listSearch = state.listSearch?.map((item:any) => get(item,'_id') === get(newPayload,'_id') ? newPayload : item);
        state.updateSuccess = newPayload;
      },
      convertFailed: (state: cloneInitState, { payload }: any) => {
        state.isSubmitLoading =  false;
        state.convertFailed = payload;
      },
      resetAction: (state:cloneInitState) => ({
        ...state,
        ...omit(this.initialState, ["list","paging","byId"]),
      }),
    
    };
    this.cloneInitState = {
      ...this.initialState,
      isLoadingGetHistoryPharmacy: false,
      getHistoryPharmacyFailed: null,
      historyPharmacy: [],

      convertSuccess: undefined,
      convertFailed: undefined,
    }
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers: this.clone,
    });
  }
}

const module = new PharmacyExtendModule();
const data = module.createSlice();

export const pharmacySliceAction = data.actions;
export default data.reducer;
