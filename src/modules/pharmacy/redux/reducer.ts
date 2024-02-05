import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
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
    };
    this.cloneInitState = {
      ...this.initialState,
      isLoadingGetHistoryPharmacy: false,
      getHistoryPharmacyFailed: null,
      historyPharmacy: [],
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
