export type TypeProps = {};

export const TYPE_REPORT = {
  groupProduct: 'groupProduct',
  groupSupplier: 'groupSupplier',
  groupCustomer: 'groupCustomer',
  groupSaler: 'groupSaler',
  groupArea: 'groupArea',
  groupCity: 'groupCity',
  groupByRangerDateWithProduct: 'groupByRangerDateWithProduct',
  groupByRangerDateWithSupplier: 'groupByRangerDateWithSupplier',
  groupByRangerDateWithCustomer: 'groupByRangerDateWithCustomer',
  groupByRangerDateWithSaler: 'groupByRangerDateWithSaler',
  groupByRangerDateWithArea: 'groupByRangerDateWithArea',
  groupByRangerDateWithCity: 'groupByRangerDateWithCity',
} as const; 
type type_report = keyof typeof TYPE_REPORT
export const TYPE_REPORT_VI: {[key in type_report]:string} = {
  groupProduct: 'Sản phẩm',
  groupByRangerDateWithProduct: 'Sản phẩm theo thời gian',
  groupSupplier: 'Nhà cung cấp',
  groupByRangerDateWithSupplier: 'Nhà cung cấp theo thời gian',
  groupCustomer: 'Khách hàng',
  groupByRangerDateWithCustomer: 'Khách hàng theo thời gian',
  groupSaler: 'Trình dược viên',
  groupByRangerDateWithSaler: 'Trình dược viên theo thời gian',
  groupArea: 'Khu vực',
  groupByRangerDateWithArea: 'Khu vực theo thời gian',
  groupCity: 'Tỉnh/ Thành phố',
  groupByRangerDateWithCity: 'Tỉnh/ Thành phố theo thời gian',
};


export const renderOptionReport = ["Product", "Supplier", "Customer", "Saler", "Area", "City"].map((el:any)=>{
  const group = 'group'+el as type_report;
  const groupW = 'groupByRangerDateWith'+el as type_report;
  return {
    label: TYPE_REPORT_VI[group],
    options:[
      { label : TYPE_REPORT_VI[TYPE_REPORT[group]],value: TYPE_REPORT[group] },
      { label : TYPE_REPORT_VI[TYPE_REPORT[groupW]],value: TYPE_REPORT[groupW] }
    ]
  }
});
export const renderOptionReportB2C = ["Product", "Supplier", "Customer", "Area", "City"].map((el:any)=>{
  const group = 'group'+el as type_report;
  const groupW = 'groupByRangerDateWith'+el as type_report;
  return {
    label: TYPE_REPORT_VI[group],
    options:[
      { label : TYPE_REPORT_VI[TYPE_REPORT[group]],value: TYPE_REPORT[group] },
      { label : TYPE_REPORT_VI[TYPE_REPORT[groupW]],value: TYPE_REPORT[groupW] }
    ]
  }
});

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
  salerId?: string[],

  rangerTime?: string[],
  rangerType?: keyof typeof FILTER_BY,
  targetTime?: string,
  
  spaceType?: 'pharma_profile'|'partner',
  reportSize?: number, // instead litmit
  page?: number,
  limit?:number
}

export const TYPE_DISPLAY: any = {
  PERCENT: "PERCENT",
  VALUE: "VALUE",
};

export function checkKeyContainsGroupByRangerDate(
  key: keyof typeof TYPE_REPORT
): boolean {
  return key.includes("groupByRangerDate");
}

export function checkKeyContains(
  keyCheck: keyof typeof TYPE_REPORT,
  textContain: string
): boolean {
  return keyCheck.includes(textContain);
}