import { createSlice as createSliceRedux } from "@reduxjs/toolkit";
import { get, omit } from "lodash";
import { getPaging } from "~/utils/helpers";
import { initStateSlice } from "./models";

export interface voidReducer {
  getListRequest : (state:initStateSlice) => void;
  getListSuccess:(state?:initStateSlice,payload?:any)=>void;
  getListFailed:(state:initStateSlice,payload?:any)=>void;
  getByIdRequest : (state:initStateSlice) => void;
  getByIdSuccess:(state:initStateSlice,payload?:any)=>void;
  getByIdFailed:(state:initStateSlice,payload?:any)=>void;
  createRequest:(state:initStateSlice,payload?:any)=>void;
  createSuccess:(state:initStateSlice,payload?:any)=>void;
  createFailed:(state:initStateSlice,payload?:any)=>void;
  updateRequest:(state:initStateSlice,payload?:any)=>void;
  updateSuccess:(state:initStateSlice,payload?:any)=>void;
  updateFailed:(state:initStateSlice,payload?:any)=>void;
  deleteRequest:(state:initStateSlice,payload?:any)=>void;
  deleteSuccess:(state:initStateSlice,payload?:any)=>void;
  deleteFailed:(state:initStateSlice,payload?:any)=>void;
  getRequest:(state:initStateSlice,payload?:any)=>void;
  getSuccess:(state:initStateSlice,payload?:any)=>void;
  getFailed:(state:initStateSlice,payload?:any)=>void;
  onSearch:(state:initStateSlice,payload?:any)=>void;
  resetAction:(state:initStateSlice,payload?:any)=>void;
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
  public initReducer = {

    // Get List
    getListRequest: (state:initStateSlice) => {
      state.isLoading = true;
      state.getListFailed = null;
    },
    getListSuccess: (state:initStateSlice , { payload }: any) => {
      state.isLoading = false;
      state.list = get(payload, "docs", []);
      state.paging = getPaging(payload);
    },
    getListFailed: (state:initStateSlice, { payload }:{payload:any}) => {
      state.isLoading = false;
      state.getListFailed = payload;
      
    },

    // Get By Id
    getByIdRequest: (state:initStateSlice) => {
      state.isGetByIdLoading = true;
      state.getByIdFailed = null;
    },
    getByIdSuccess: (state:initStateSlice, { payload }:{payload?:any}) => {
      state.isGetByIdLoading = false;
      state.byId = payload;
    },
    getByIdFailed: (state:initStateSlice, { payload }:{payload:any}) => {
      state.isGetByIdLoading = false;
      state.getByIdFailed = payload;
    },
    // Create
    createRequest: (state:initStateSlice) => {
      state.isSubmitLoading = true;
      state.createFailed = null;
    },
    createSuccess: (state:initStateSlice, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.createSuccess = payload;
    },
    createFailed: (state:initStateSlice, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.createFailed = payload;
    },

    // Update
    updateRequest: (state: initStateSlice) => {
      state.isSubmitLoading = true;
      state.updateFailed = null;
    },
    updateSuccess: (state:initStateSlice, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.byId = payload;
      state.list = state.list?.map((item:any) => get(item,'_id') === get(payload,'_id') ? payload : item);
      state.listSearch = state.listSearch?.map((item:any) => get(item,'_id') === get(payload,'_id') ? payload : item);
      state.updateSuccess = payload;
    },
    updateFailed: (state:initStateSlice, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.updateFailed = payload;
    },

    // delete
    deleteRequest: (state:initStateSlice) => {
      state.isSubmitLoading = true;
      state.deleteFailed = null;
    },
    deleteSuccess: (state:initStateSlice, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.deleteSuccess = payload;
    },
    deleteFailed: (state:initStateSlice, { payload }:{payload:any}) => {
      state.isSubmitLoading = false;
      state.deleteFailed = payload;
    },

    // Get By ID
    getRequest: (state:initStateSlice) => {
      state.isGetByIdLoading = true;
      state.getByIdFailed = null;
    },
    getSuccess: (state:initStateSlice, { payload }:{payload:any}) => {
      state.isGetByIdLoading = false;
      state.byId = payload;
    },
    getFailed: (state:initStateSlice, { payload }:{payload:any}) => {
      state.isGetByIdLoading = false;
      state.getByIdFailed = payload;
    },

    onSearch (state:any, { payload }:any) {
      state.listSearch = payload;
    },
    clearAction: (state : initStateSlice) => {
      state.getByIdFailed = null;
      state.getListFailed = null;
      state.createSuccess = null;
      state.createFailed = null;
      state.updateSuccess = null;
      state.updateFailed = null;
      state.deleteSuccess = null;
      state.deleteFailed = null;
      state.submitSuccess = null;
      state.submitFailed = null;
    },
    // Reset the state
    reset: () => this.initialState,
    // Reset the state Action
    resetAction: (state:initStateSlice) => ({
      ...state,
      ...omit(this.initialState, ["list",'paging']),
    }),
};

  constructor(module: string) {
    this.module = module;
  }

 createSlice() {
    return createSliceRedux({
      name: this.module,
      initialState: this.initialState,
      reducers: this.initReducer,
    });
  }
}
