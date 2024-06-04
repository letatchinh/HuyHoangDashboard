export const STATUS_BILL = {
  NEW: "NEW",
  READY: "READY",
  PACKAGE_EXPORT: "PACKAGE_EXPORT",
  SHIPPING: "SHIPPING",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};
export const STATUS_BILL_VI = {
  NEW: "Đã tiếp nhận",
  READY: 'Yêu cầu xuất kho', 
  PACKAGE_EXPORT: 'Đang xuất kho',
  SHIPPING: 'Đang gửi hàng',
  PROCESSING: "Đang xử lý",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã huỷ",
};

export const defaultFee = [
  {
    typeFee: 'SUB_FEE',
    typeValue: 'VALUE',
    value: 0
  },
  {
    typeFee: 'LOGISTIC',
    typeValue: 'VALUE',
    value: 0
  },
];
