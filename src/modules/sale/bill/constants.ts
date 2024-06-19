export const STATUS_BILL = {
  NEW: "NEW",
  READY: "READY",
  UNREADY: "UNREADY",
  REQUESTED: "REQUESTED",
  PACKAGE_EXPORT: "PACKAGE_EXPORT",
  SHIPPING: "SHIPPING",
  // PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};
export const STATUS_BILL_VI = {
  NEW: "Đã tiếp nhận",
  READY: 'Sẵn sàng xuất kho', 
  UNREADY: 'Không sẵn sàng xuất kho', 
  REQUESTED: 'Đã gửi yêu cầu xuất kho',
  PACKAGE_EXPORT: 'Đang xuất kho',
  SHIPPING: 'Đang gửi hàng',
  // PROCESSING: "Đang xử lý",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã huỷ",
};

export const STATUS_BILL_LEVEL = {
  NEW: 1,
  REQUESTED: 2,
  PACKAGE_EXPORT: 3,
  SHIPPING: 4,
  COMPLETED: 5,
  CANCELLED: 6,
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
