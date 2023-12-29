import requester from "~/api/requester";

const apis = {
  getAreas: () => requester.get("/api/v1/area"),
  getCities: () => requester.get("/api/v1/city"),
  getDistricts: (cityCode: any) =>
    requester.get(`/api/v1/city/${cityCode}/district`),
  getWards: (districtCode: any) =>
    requester.get(`/api/v1/district/${districtCode}/ward`),
};
export default apis;
