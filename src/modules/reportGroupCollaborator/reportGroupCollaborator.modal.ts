export type TypeProps = {};
export type datatypeReportType =
  | "reportProduct"
  | "reportBill"
  | "reportRangerTypeProduct"
  | "reportRangerTypeBill";
//   | "reportRangerTypeDebt";


export const datatypeReportVi = {
  reportProduct: "Danh mục tiêu thụ",
  reportBill: "Đơn hàng phát sinh",
  reportRangerTypeProduct: "Danh mục tiêu thụ theo kì",
  reportRangerTypeBill: "Đơn hàng phát sinh theo kì",
} satisfies Record<datatypeReportType, string>;
