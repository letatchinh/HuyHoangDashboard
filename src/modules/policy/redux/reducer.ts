import { createSlice } from "@reduxjs/toolkit";
import { InitState, InstanceModuleRedux } from "~/redux/instanceModuleRedux";
import { resources } from "../policy.modal";
interface cloneInitState extends InitState {
  // Add cloneInitState Type Here
  userPolicy?: any;
  isGetResourcesLoading?: boolean;
  resources?: any;
  actions?: any;
  getResourcesFailed?: any;
}

const data = createSlice({
  name: 'policy',
  initialState: {
    ...InstanceModuleRedux.initialState,
    userPolicy: null,
    isGetResourcesLoading: false,
    resources: null,
    actions: null,
    getResourcesFailed: null
  },
  reducers: {
    ...InstanceModuleRedux.initReducer,
    getByUserLoginResourceRequest: (state: cloneInitState, { payload }: any) => {
      state.userPolicy = payload;
    },
    getByUserLoginResourceSuccess: (state: cloneInitState, { payload }: any) => {
      state.userPolicy = payload;
    },
    getByUserLoginResourceFailed: (state: cloneInitState, { payload }: any) => {
      state.userPolicy = null;
    },

    getResourcesRequest: (state: cloneInitState, { payload }: any) => {
      state.isGetResourcesLoading = true;
    },
    getResourcesSuccess: (state: cloneInitState, { payload }: any) => {
      state.resources = payload.resources;
      state.isGetResourcesLoading = false;
      state.actions = payload.actions;
    },
    getResourcesFailed: (state: cloneInitState, { payload }: any) => {
      state.isGetResourcesLoading = false;
      state.resources = null;
      state.actions = null;
    },

    updateResourcesRequest: (state: cloneInitState, { payload }: any) => {
      state.isGetResourcesLoading = true;
    },
    updateResourcesSuccess: (state: cloneInitState, { payload }: { payload: { actions: resources[], resources: resources[] } }) => {
      state.resources = payload.resources;
      state.isGetResourcesLoading = false;
      state.actions = payload.actions;
    },
    updateResourcesFailed: (state: cloneInitState, { payload }: any) => {
      state.isGetResourcesLoading = false;
      state.getResourcesFailed = payload;
    },
    updateResourceRedux: (state: cloneInitState, { payload }: any) => {
      state.byId = state.byId.map((item: any) => {
        if (item.key === payload.resource) {
          return {
            ...item,
            [payload.action]: payload.isAssigned
          }
        }
        return item
      })
    },
  }
})
export const policyActions = data.actions;
export default data.reducer