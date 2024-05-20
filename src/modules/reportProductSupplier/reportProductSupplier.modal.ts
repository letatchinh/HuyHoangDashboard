export type TypeProps = {};

export const TYPE_REPORT = {
  groupProduct: 'groupProduct',
  groupSupplier: 'groupSupplier',
  groupCustomer: 'groupCustomer',
  groupArea: 'groupArea',
  groupCity: 'groupCity',
  groupByRangerDateWithProduct: 'groupByRangerDateWithProduct',
  groupByRangerDateWithSupplier: 'groupByRangerDateWithSupplier',
  groupByRangerDateWithCustomer: 'groupByRangerDateWithCustomer',
} as const; 

export const TYPE_REPORT_VI: {[key in keyof typeof TYPE_REPORT]:string} = {
  groupProduct: 'Sản phẩm',
  groupSupplier: 'Nhà cung cấp',
  groupCustomer: 'Khách hàng',
  groupArea: 'Khu vực',
  groupCity: 'Tỉnh/Thành phố',
  groupByRangerDateWithProduct: 'Sản phẩm theo thời gian',
  groupByRangerDateWithSupplier: 'Nhà cung cấp theo thời gian',
  groupByRangerDateWithCustomer: 'Khách hàng theo thời gian',
};

export const FILTER_BY: any = {
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  YEARLY: "YEARLY",
};
export const FILTER_BY_VI: any = {
  WEEKLY: "Tuần",
  MONTHLY: "Tháng",
  QUARTERLY: "Quý",
  YEARLY: "Năm",
};

export interface getReportProductbody {
  dataType?: keyof typeof TYPE_REPORT,

  areaId?: string[],
  cityId?: string[],

  productId?: string[],
  customerId?: string[],
  supplierId?: string[],

  rangerTime?: string[],
  rangerType?: keyof typeof FILTER_BY,
  targetTime?: string,
  
  spaceType?: 'pharma_profile'|'partner',
  reportSize?: number, // instead litmit
  page?: number,

}