export const STATUS_BILL = {
  NEW: "NEW",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};
export const STATUS_BILL_VI = {
  NEW: "Đã tiếp nhận",
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

