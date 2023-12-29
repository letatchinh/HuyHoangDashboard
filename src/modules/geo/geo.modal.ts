export type GeoState = {
    areas: any[];
    isAreasLoading: boolean;
    getAreasFailed: null | any;
  
    cities: any[];
    isCitiesLoading: boolean;
    getCitiesFailed: null | any;
  
    districts: any[];
    isDistrictsLoading: boolean;
    getDistrictsFailed: null | any;
  
    wards: any[];
    isWardsLoading: boolean;
    getWardsFailed: null | any;
  
    isLoadingAddAddress: boolean;
  
    addAddressSuccess: null | any;
    addAddressFailed: null | any;
  
    updateAddressSuccess: null | any;
    updateAddressFailed: null | any;
  
    deleteAddressSuccess: null | any;
    deleteAddressFailed: null | any;
  
    address: any[];
    getAddressFailed: null | any;
    isLoadingGetAddress: boolean;
  };