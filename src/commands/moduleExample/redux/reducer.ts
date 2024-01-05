import { createSlice } from '@reduxjs/toolkit';
import { get, omit } from 'lodash';
import { getPaging } from '~/utils/helpers';
const initialState : any = {
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
  }

export const moduleExample = createSlice({
    name: 'moduleExample',
    initialState,
    reducers: {

        // Get List
        getListRequest: (state:any) => {
          state.isLoading = true;
          state.getListFailed = null;
        },
        getListSuccess: (state:any, { payload }:any) => {
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
        reset: () => initialState,
        // Reset the state Action
        resetAction: (state:any) => ({
          ...state,
          ...omit(initialState, ["list"]),
        }),
    }})

// Action creators are generated for each case reducer function
export const moduleExampleActions = moduleExample.actions

export default moduleExample.reducer