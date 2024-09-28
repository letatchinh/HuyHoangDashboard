interface AreaType {
  code : "string",
  name : "string",
  unit : "string",
}
declare module 'sub-vn' {
  export function getAreas(): AreaType[];
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
  export function getProvindByAreaCode(code: string): any;
};


interface WithTimeStamp {
  updatedAt: Date;
  createdAt: Date;
}

interface WithId<D = any> {
  _id: D & string;
}

interface AggregatePaginateResult<T> {
  docs: T[];
  totalDocs: number;
  limit: number;
  page?: number | undefined;
  totalPages: number;
  nextPage?: number | null | undefined;
  prevPage?: number | null | undefined;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  meta?: any;
}

interface WithStatus {
  status : "ACTIVE" | "INACTIVE"
}