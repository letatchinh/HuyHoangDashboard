import { FILTER_BY } from "~/constants/defaultValue";

export type TypeProps = {};

export type datatypeReportType =
  | "reportProduct"
  | "reportBill"
  | "reportRangerTypeProduct"
  | "reportRangerTypeBill"
//   | "reportRangerTypeDebt";

export const datatypeReport = {
  reportProduct: "reportProduct",
  reportBill: "reportBill",
  reportRangerTypeProduct: "reportRangerTypeProduct",
  reportRangerTypeBill: "reportRangerTypeBill",
  //   reportRangerTypeDebt: "reportRangerTypeDebt",
} satisfies Record<datatypeReportType, datatypeReportType>;
export const datatypeReportVi = {
  reportProduct: "Số lượng danh mục tiêu thụ",
  reportBill: "Số lượng đơn hàng phát sinh",
  reportRangerTypeProduct: "Số lượng danh mục tiêu thụ theo kì",
  reportRangerTypeBill: "Số lượng đơn hàng phát sinh theo kì",
  //   reportRangerTypeDebt: "Công nợ tồn động theo kì",
} satisfies Record<datatypeReportType, string>;

export interface getReportSelfCTV {
  sellerId?: string[];
  rangerTime?: [string, string];
  rangerType?: keyof typeof FILTER_BY;
  productId?: string[];
  datatype: datatypeReportType;
}
