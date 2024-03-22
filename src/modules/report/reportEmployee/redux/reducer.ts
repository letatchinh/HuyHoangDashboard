import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
  // Add cloneInitState Type Here
  updatePreviewFailed?: any;
  updatePreviewSuccess?: any;
}
class ReportEmployeeClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState: cloneInitState;
  constructor() {
    super("reportEmployee");
    this.cloneReducer = {
      ...this.initReducer,
      // Get By Id
      getByIdRequest: (state: cloneInitState) => {
        state.isGetByIdLoading = true;
        state.getByIdFailed = null;
      },
      getByIdSuccess: (
        state: cloneInitState,
        { payload }: { payload?: any }
      ) => {
        state.isGetByIdLoading = false;
        state.byId = {
          ...payload,
          salary: {
            ...get(payload, "salary"),
            totalBonus: [
              get(payload, "salary.bonus.overMonth", 0),
              get(payload, "salary.bonus.overQuarter", 0),
              get(payload, "salary.bonus.overYear", 0),
              get(payload, "salary.bonus.workingBenefit", 0),
              get(payload, "salary.bonus.cover_pos", 0),
              get(payload, "salary.bonus.exclusive_product", 0),
              get(payload, "salary.bonus.targetsLeader", 0),
            ].reduce((sum, cur) => sum + cur, 0),
          },
          targetsTeam: {
            ...get(payload, "targetsTeam", {}),
            targetSupplier: get(payload, "targetsTeam.targetSupplier", [])?.map(
              (target: any) => ({
                ...target,
                saleCanChange:
                  get(target, "afterExchangeSale", 0) -
                  get(target, "targetTeam", 0),
              })
            ),
          },
          targetsSelf: {
            ...get(payload, "targetsSelf", {}),
            targetSupplier: get(payload, "targetsSelf.targetSupplier", [])?.map(
              (target: any) => ({
                ...target,
                saleCanChange:
                  get(target, "afterExchangeSale", 0) -
                  get(target, "minSale", 0),
              })
            ),
          },
        };
      },
      getByIdFailed: (state: cloneInitState, { payload }: { payload: any }) => {
        state.isGetByIdLoading = false;
        state.getByIdFailed = payload;
      },

      // Update preview
      updatePreviewRequest: (state: cloneInitState) => {
        state.isSubmitLoading = true;
        state.updatePreviewFailed = null;
      },
      updatePreviewSuccess: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.byId = payload;
        state.updatePreviewSuccess = payload;
      },
      updatePreviewFailed: (
        state: cloneInitState,
        { payload }: { payload: any }
      ) => {
        state.isSubmitLoading = false;
        state.updatePreviewFailed = payload;
      },

      // Want Add more reducer Here...
    };
    this.cloneInitState = {
      ...this.initialState,
      // Want Add more State Here...
    };
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers: this.cloneReducer,
    });
  }
}

const newSlice = new ReportEmployeeClassExtend();
const data = newSlice.createSlice();

export const reportEmployeeActions = data.actions;
export default data.reducer;
