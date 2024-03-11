import { createSlice } from "@reduxjs/toolkit";
import { omit } from "lodash";
import { InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { initStateSlice } from "~/redux/models";
interface cloneInitState extends initStateSlice {
  reportConfigBenefitTable? : any,
  isReportConfigBenefitTableLoading? : any,
  reportConfigBenefitTableFailed? : any,

  reportConfigBenefitData? : any,
  isReportConfigBenefitDataLoading? : any,
  reportConfigBenefitDataFailed? : any,
  
  createConditionFailed? : any,
  createConditionSuccess? : any,
  updateConditionFailed? : any,
  updateConditionSuccess? : any,
  deleteConditionFailed? : any,
  deleteConditionSuccess? : any,

  createBenefitFailed? : any,
  createBenefitSuccess? : any,
  deleteBenefitFailed? : any,
  deleteBenefitSuccess? : any,

  createConfigFailed? : any,
  createConfigSuccess? : any,
  updateConfigFailed? : any,
  updateConfigSuccess? : any,

 // Add cloneInitState Type Here
}
class BenefitConfigurationClassExtend extends InstanceModuleRedux {
  cloneReducer;
  cloneInitState : cloneInitState;
  constructor() {
    super('benefitConfiguration');
    this.cloneReducer = {
      ...this.initReducer,
        // Get Benefit Config Table
        GetReportConfigBenefitTableRequest: (state:cloneInitState) => {
      state.isReportConfigBenefitTableLoading = true;
      state.reportConfigBenefitTableFailed = null;
    },
    GetReportConfigBenefitTableSuccess: (state:cloneInitState, { payload }:{payload?:any}) => {
      state.isReportConfigBenefitTableLoading = false;
      state.reportConfigBenefitTable = payload;
    },
    GetReportConfigBenefitTableRequestFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isReportConfigBenefitTableLoading = false;
      state.reportConfigBenefitTableFailed = payload;
    },

        // Get Benefit Config Data
        GetReportConfigBenefitDataRequest: (state:cloneInitState) => {
      state.isReportConfigBenefitDataLoading = true;
      state.reportConfigBenefitDataFailed = null;
    },
    GetReportConfigBenefitDataSuccess: (state:cloneInitState, { payload }:{payload?:any}) => {
      state.isReportConfigBenefitDataLoading = false;
      state.reportConfigBenefitData = payload;
    },
    GetReportConfigBenefitDataRequestFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isReportConfigBenefitDataLoading = false;
      state.reportConfigBenefitDataFailed = payload;
    },

    // Create Condition
    createConditionRequest: (state:cloneInitState) => {
      state.isSubmitLoading = true;
      state.createConditionFailed = null;
    },
    createConditionSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.createConditionSuccess = payload;
    },
    createConditionFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.createConditionFailed = payload;
    },
    // update Condition
    updateConditionRequest: (state:cloneInitState) => {
      state.isSubmitLoading = true;
      state.updateConditionFailed = null;
    },
    updateConditionSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.updateConditionSuccess = payload;
    },
    updateConditionFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.updateConditionFailed = payload;
    },

    // delete Condition
    deleteConditionRequest: (state:cloneInitState) => {
      state.isSubmitLoading = true;
      state.deleteConditionFailed = null;
    },
    deleteConditionSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.deleteConditionSuccess = payload;
    },
    deleteConditionFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.deleteConditionFailed = payload;
    },

    // Create Benefit
    createBenefitRequest: (state:cloneInitState) => {
      state.isSubmitLoading = true;
      state.createBenefitFailed = null;
    },
    createBenefitSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.createBenefitSuccess = payload;
    },
    createBenefitFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.createBenefitFailed = payload;
    },

    // delete Benefit
    deleteBenefitRequest: (state:cloneInitState) => {
      state.isSubmitLoading = true;
      state.deleteBenefitFailed = null;
    },
    deleteBenefitSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.deleteBenefitSuccess = payload;
    },
    deleteBenefitFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.deleteBenefitFailed = payload;
    },

    // Create Config
    createConfigRequest: (state:cloneInitState) => {
      state.isSubmitLoading = true;
      state.createConfigFailed = null;
    },
    createConfigSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.createConfigSuccess = payload;
    },
    createConfigFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.createConfigFailed = payload;
    },

    // update Config
    updateConfigRequest: (state:cloneInitState) => {
      state.isSubmitLoading = true;
      state.updateConfigFailed = null;
    },
    updateConfigSuccess: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.updateConfigSuccess = payload;
    },
    updateConfigFailed: (state:cloneInitState, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.updateConfigFailed = payload;
    },

    resetAction: (state:any) => ({
      ...state,
      ...omit(this.cloneInitState, ["list","reportConfigBenefitTable","reportConfigBenefitData"]),
    }),
      // Want Add more reducer Here...
    }
    this.cloneInitState = {
      ...this.initialState,
      reportConfigBenefitTable: null,
      isReportConfigBenefitTableLoading: false,
      reportConfigBenefitTableFailed: null,

      reportConfigBenefitData: null,
      isReportConfigBenefitDataLoading: false,
      reportConfigBenefitDataFailed: null,

      createConditionFailed: null,
      createConditionSuccess: null,

      createBenefitFailed: null,
      createBenefitSuccess: null,

      createConfigFailed: null,
      createConfigSuccess: null,
      // Want Add more State Here...
    };
  }
  createSlice() {
    return createSlice({
      name: this.module,
      initialState: this.cloneInitState,
      reducers:  this.cloneReducer,
    });
  }
  
}

const newSlice = new BenefitConfigurationClassExtend();
const data = newSlice.createSlice();


export const benefitConfigurationActions = data.actions;
export default data.reducer;
