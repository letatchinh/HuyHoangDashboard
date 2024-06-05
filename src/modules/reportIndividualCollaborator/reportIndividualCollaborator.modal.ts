import { FILTER_BY } from "~/constants/defaultValue";

export type TypeProps = {};

export type datatypeReportType = "reportProduct"| "reportBill"| "reportRangerTypeProduct"| "reportRangerTypeBill"| "reportRangerTypeDebt"

export const datatypeReport = {
  reportProduct: "reportProduct",
  reportBill: "reportBill",
  reportRangerTypeProduct: "reportRangerTypeProduct",
  reportRangerTypeBill: "reportRangerTypeBill",
  reportRangerTypeDebt: "reportRangerTypeDebt",
}satisfies Record< datatypeReportType,datatypeReportType>  ;
export const datatypeReportVi = {
  reportProduct: "Danh mục tiêu thụ",
  reportBill: "Đơn hàng phát sinh",
  reportRangerTypeProduct: "Danh mục tiêu thụ theo kì",
  reportRangerTypeBill: "Đơn hàng phát sinh theo kì",
  reportRangerTypeDebt: "Công nợ tồn động theo kì",
}satisfies Record< datatypeReportType,string>  ;

export interface getReportSelfCTV {
  sellerId?: string[];
  rangerTime?: [string, string];
  rangerType?: keyof typeof FILTER_BY;
  productId?: string[];
  datatype:  datatypeReportType;
}
