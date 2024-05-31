export type TypeProps = {};
export type datatypeReportType =
  | "reportProduct"
  | "reportBill"
  | "reportRangerTypeProduct"
  | "reportRangerTypeBill";
//   | "reportRangerTypeDebt";


export const datatypeReportVi = {
  reportProduct: "Số lượng danh mục tiêu thụ",
  reportBill: "Số lượng đơn hàng phát sinh",
  reportRangerTypeProduct: "Số lượng danh mục tiêu thụ theo kì",
  reportRangerTypeBill: "Số lượng đơn hàng phát sinh theo kì",
} satisfies Record<datatypeReportType, string>;
