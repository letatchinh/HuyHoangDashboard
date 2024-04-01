import { RootState } from "~/redux/store";
import { useFetch, useFetchByParam } from "~/utils/hook";
import { GeoState } from "./geo.modal";
import { geoActions } from "./redux/reducer";
import subvn from "~/core/subvn";

const getSelector = (key: keyof GeoState) => (state: RootState) =>
  state.geo[key];

const areasLoadingSelector = getSelector("isAreasLoading");
const areasSelector = getSelector("areas");
const getAreasFailedSelector = getSelector("getAreasFailed");

const citiesLoadingSelector = getSelector("isCitiesLoading");
const citiesSelector = getSelector("cities");
const getCitiesFailedSelector = getSelector("getCitiesFailed");

const districtsLoadingSelector = getSelector("isDistrictsLoading");
const districtsSelector = getSelector("districts");
const getDistrictsFailedSelector = getSelector("getDistrictsFailed");

const wardsLoadingSelector = getSelector("isWardsLoading");
const wardsSelector = getSelector("wards");
const getWardsFailedSelector = getSelector("getWardsFailed");

export const useAreas = () =>
  useFetch({
    action: geoActions.getAreasRequest,
    loadingSelector: areasLoadingSelector,
    dataSelector: areasSelector,
    failedSelector: getAreasFailedSelector,
  });

export const useCities = () =>
  useFetch({
    action: geoActions.getCitiesRequest,
    loadingSelector: citiesLoadingSelector,
    dataSelector: citiesSelector,
    failedSelector: getCitiesFailedSelector,
  });

// export const useDistricts = (cityCode: any) => subvn.getDistrictsByProvinceCode(cityCode)
  // useFetchByParam({
  //   action: geoActions.getDistrictsRequest,
  //   loadingSelector: districtsLoadingSelector,
  //   dataSelector: districtsSelector,
  //   failedSelector: getDistrictsFailedSelector,
  //   param: cityCode,
  // });

export const useWards = (districtCode: any) =>
  useFetchByParam({
    action: geoActions.getWardsRequest,
    loadingSelector: wardsLoadingSelector,
    dataSelector: wardsSelector,
    failedSelector: getWardsFailedSelector,
    param: districtCode,
  });

  export const useDistricts = (cityCode:any) =>
  useFetchByParam({
    action: geoActions.getDistrictsRequest,
    loadingSelector: districtsLoadingSelector,
    dataSelector: districtsSelector,
    failedSelector: getDistrictsFailedSelector,
    param: cityCode
  });