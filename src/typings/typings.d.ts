declare module 'sub-vn' {
  export function getWardsByDistrictCode(code: string): any;
  export function getProvinces(): [any];
  export function getDistricts(): [any];
  export function getWards(): [any];
  export function getProvincesWithDetail(): [any];
  export function getDistrictsByProvinceCode(code: string): [any];
  export function getWardsByDistrictCode(code: string): [any];
  export function getWardsByProvinceCode(code: string): [any];
  export function getWardsByCode(code: string): any;
  export function getCityByCode(code: string): any;
  export function getDistrictByCode(code: string): any;
};


