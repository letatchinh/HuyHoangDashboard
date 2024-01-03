import { createSlice } from "@reduxjs/toolkit";
import { get } from 'lodash';
import { GeoState } from "../geo.modal";


const initialState : GeoState = {
  areas: [],
  isAreasLoading: false,
  getAreasFailed: null,

  cities: [],
  isCitiesLoading: false,
  getCitiesFailed: null,

  districts: [],
  isDistrictsLoading: false,
  getDistrictsFailed: null,

  wards: [],
  isWardsLoading: false,
  getWardsFailed: null,

  isLoadingAddAddress : false,

  addAddressSuccess : null,
  addAddressFailed : null,

  updateAddressSuccess : null,
  updateAddressFailed : null,

  deleteAddressSuccess : null,
  deleteAddressFailed : null,

  address : [],
  getAddressFailed : null,
  isLoadingGetAddress : false,
};
export const geo = createSlice({
  name: 'geo',
  initialState,
  reducers: {
    // GET AREA 
    getAreasRequest: (state, { payload }) => {
      state.isAreasLoading = true;
      state.areas = [];
      state.getAreasFailed = null;
    },
    getAreasSuccess: (state, { payload }) => {
      state.isAreasLoading = false;
      state.areas = payload;
    },
    getAreasFailed: (state, { payload }) => {
      state.isAreasLoading = false;
      state.getAreasFailed = payload;
    },
    
    // GET CITIES 
    getCitiesRequest: (state, { payload }) => {
      state.isCitiesLoading = true;
      state.cities = [];
      state.getCitiesFailed = null;
    },
    getCitiesSuccess: (state, { payload }) => {
      state.isCitiesLoading = false;
      state.cities = payload;
    },
    getCitiesFailed: (state, { payload }) => {
      state.isCitiesLoading = false;
      state.getCitiesFailed = payload;
    },
    // GET DISTRICTS 
    getDistrictsRequest: (state, { payload }) => {
      state.isDistrictsLoading = true;
      state.districts = [];
      state.getDistrictsFailed = null;
    },
    getDistrictsSuccess: (state, { payload }) => {
      state.isDistrictsLoading = false;
      state.districts = payload;
    },
    getDistrictsFailed: (state, { payload }) => {
      state.isDistrictsLoading = false;
      state.getDistrictsFailed = payload;
    },
    // GET WARDS 
    getWardsRequest: (state, { payload }) => {
      state.isWardsLoading = true;
      state.wards = [];
      state.getWardsFailed = null;
    },
    getWardsSuccess: (state, { payload }) => {
      state.isWardsLoading = false;
      state.wards = payload;
    },
    getWardsFailed: (state, { payload }) => {
      state.isWardsLoading = false;
      state.getWardsFailed = payload;
    },

    // GET ADDRESS 
    getAddressRequest: (state, { payload }) => {
      state.isLoadingGetAddress = true;
      state.address = [];
      state.getAddressFailed = null;
    },
    getAddressSuccess: (state, { payload }) => {
      state.isLoadingGetAddress = false;
      payload?.sort((a : any,b : any) => get(b,'isPrimary') - get(a,'isPrimary'))
      state.address = payload;
    },
    getAddressFailed: (state, { payload }) => {
      state.isLoadingGetAddress = false;
      state.getAddressFailed = payload;
    },

    // Add Address
    addAddressRequest: (state, { payload }) => {
      state.isLoadingAddAddress = true;
      state.addAddressFailed = null;
    },
    addAddressSuccess: (state, { payload }) => {
      state.isLoadingAddAddress = false;
      state.addAddressSuccess = payload;
    },
    addAddressFailed: (state, { payload }) => {
      state.isLoadingAddAddress = false;
      state.addAddressFailed = payload;
    },


    // Update Address
    updateAddressRequest: (state, { payload }) => {
      state.isLoadingAddAddress = true;
      state.updateAddressFailed = null;
    },
    updateAddressSuccess: (state, { payload }) => {
      state.isLoadingAddAddress = false;
      state.updateAddressSuccess = payload;
    },
    updateAddressFailed: (state, { payload }) => {
      state.isLoadingAddAddress = false;
      state.updateAddressFailed = payload;
    },

    // Delete Address
    deleteAddressRequest: (state, { payload }) => {
      state.isLoadingAddAddress = true;
      state.deleteAddressFailed = null;
    },
    deleteAddressSuccess: (state, { payload }) => {
      state.isLoadingAddAddress = false;
      state.deleteAddressSuccess = payload;
      state.address = state.address?.filter((add : any) => get(add,'_id') !== payload)
    },
    deleteAddressFailed: (state, { payload }) => {
      state.isLoadingAddAddress = false;
      state.deleteAddressFailed = payload;
    },


    // Reset the state
    resetGeo : () => initialState,
    // Reset the address Selector
    resetAddressAction : (state) => {
      state.addAddressSuccess  = null;
      state.addAddressFailed  = null;
      state.getAddressFailed  = null;
      state.updateAddressSuccess  = null;
      state.updateAddressFailed  = null;
      state.deleteAddressSuccess  = null;
      state.deleteAddressFailed  = null;
    },

  },
})

// Action creators are generated for each case reducer function
export const geoActions = geo.actions
export default geo.reducer
