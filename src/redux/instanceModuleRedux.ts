import { createSlice as createSliceRedux } from "@reduxjs/toolkit";
import { get, omit } from "lodash";
import { getPaging } from "~/utils/helpers";
import { initStateSlice } from "./models";

export interface voidReducer {
  getListRequest : (state:any) => void;
  getListSuccess:(state:any,payload?:any)=>void;
  getListFailed:(state:any,payload?:any)=>void;
  getByIdRequest : (state:any) => void;
  getByIdSuccess:(state:any,payload?:any)=>void;
  getByIdFailed:(state:any,payload?:any)=>void;
  createRequest:(state:any,payload?:any)=>void;
  createSuccess:(state:any,payload?:any)=>void;
  createFailed:(state:any,payload?:any)=>void;
  updateRequest:(state:any,payload?:any)=>void;
  updateSuccess:(state:any,payload?:any)=>void;
  updateFailed:(state:any,payload?:any)=>void;
  deleteRequest:(state:any,payload?:any)=>void;
  deleteSuccess:(state:any,payload?:any)=>void;
  deleteFailed:(state:any,payload?:any)=>void;
  getRequest:(state:any,payload?:any)=>void;
  getSuccess:(state:any,payload?:any)=>void;
  getFailed:(state:any,payload?:any)=>void;
  onSearch:(state:any,payload?:any)=>void;
  resetAction:(state:any,payload?:any)=>void;
  reset: () => void;
}

export class InstanceModuleRedux{
  module: string;
  initialState: initStateSlice = {
    isLoading: false,
    list: [],
    listSearch: [],
    getListFailed: null,

    paging : null,

    createSuccess: null,
    createFailed: null,

    updateSuccess: null,
    updateFailed: null,

    deleteSuccess: null,
    deleteFailed: null,

    submitSuccess: null,
    submitFailed: null,

    isSubmitLoading: false,

    byId: null,
    isGetByIdLoading: false,
    getByIdFailed: null,
  };
  initReducer = {

    // Get List
    getListRequest: (state:any) => {
      state.isLoading = true;
      state.getListFailed = null;
    },
    getListSuccess: (state: any, { payload }: any) => {
      state.isLoading = false;
      state.list = get(payload, "docs", []);
      state.paging = getPaging(payload);
    },
    getListFailed: (state:any, { payload }:any) => {
      state.isLoading = false;
      state.getListFailed = payload;
    },

    // Get By Id
    getByIdRequest: (state:any) => {
      state.isGetByIdLoading = true;
      state.getByIdFailed = null;
    },
    getByIdSuccess: (state:any, { payload }:any) => {
      state.isGetByIdLoading = false;
      state.byId = payload;
    },
    getByIdFailed: (state:any, { payload }:any) => {
      state.isGetByIdLoading = false;
      state.getByIdFailed = payload;
    },
    // Create
    createRequest: (state: { isSubmitLoading: boolean; createFailed: any; }) => {
      state.isSubmitLoading = true;
      state.createFailed = null;
    },
    createSuccess: (state: { isSubmitLoading: boolean; createSuccess: any; }, { payload }: any) => {
      state.isSubmitLoading = false;
      state.createSuccess = payload;
    },
    createFailed: (state: { isSubmitLoading: boolean; createFailed: any; }, { payload }: any) => {
      state.isSubmitLoading = false;
      state.createFailed = payload;
    },

    // Update
    updateRequest: (state: { isSubmitLoading: boolean; updateFailed: any; }) => {
      state.isSubmitLoading = true;
      state.updateFailed = null;
    },
    updateSuccess: (state: { isSubmitLoading: boolean; updateSuccess: any; }, { payload }: any) => {
      state.isSubmitLoading = false;
      state.updateSuccess = payload;
    },
    updateFailed: (state: { isSubmitLoading: boolean; updateFailed: any; }, { payload }: any) => {
      state.isSubmitLoading = false;
      state.updateFailed = payload;
    },

    // delete
    deleteRequest: (state: { isSubmitLoading: boolean; deleteFailed: null; }) => {
      state.isSubmitLoading = true;
      state.deleteFailed = null;
    },
    deleteSuccess: (state: { isSubmitLoading: boolean; deleteSuccess: any; }, { payload }: any) => {
      state.isSubmitLoading = false;
      state.deleteSuccess = payload;
    },
    deleteFailed: (state: { isSubmitLoading: boolean; deleteFailed: any; }, { payload }: any) => {
      state.isSubmitLoading = false;
      state.deleteFailed = payload;
    },

    // Get By ID
    getRequest: (state: { isGetByIdLoading: boolean; getByIdFailed: any; }) => {
      state.isGetByIdLoading = true;
      state.getByIdFailed = null;
    },
    getSuccess: (state: { isGetByIdLoading: boolean; byId: any; }, { payload }: any) => {
      state.isGetByIdLoading = false;
      state.byId = payload;
    },
    getFailed: (state: { isGetByIdLoading: boolean; getByIdFailed: any; }, { payload }: any) => {
      state.isGetByIdLoading = false;
      state.getByIdFailed = payload;
    },

    onSearch (state:any, { payload }:any) {
      state.listSearch = payload;
    },
    // Reset the state
    reset: () => this.initialState,
    // Reset the state Action
    resetAction: (state:any) => ({
      ...state,
      ...omit(this.initialState, ["list"]),
    }),
} as const;


  constructor(module: string) {
    this.module = module;
  }

  extendsStates(moreInitState:{[key:string]:any}){
    Object.assign(this.initialState,moreInitState);
  }
  extendsSlice(moreSlice:{[key:string]:( state:any,payload:any)=>void}){
    Object.assign(this.initReducer,moreSlice)
  }

  createSlice() {
    return createSliceRedux({
      name: this.module,
      initialState: this.initialState,
      reducers:  this.initReducer,
    });
  }
}
