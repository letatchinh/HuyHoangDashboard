export const STATUS_ORDER_SUPPLIER = {
  NEW: "NEW",
  PROCESSING: "PROCESSING",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};
export const STATUS_ORDER_SUPPLIER_VI = {
  NEW: "Đã tiếp nhận",
  PROCESSING: "Đang xử lý",
  COMPLETED: "Đã hoàn thành",
  CANCELLED: "Đã huỷ",
};
export const STATUS_ORDER_ITEM = {
  NEW: "NEW",
  CONFIRM: "CONFIRM",
  ORDERING: "ORDERING",
  RECEIVED: "RECEIVED",
  PACKAGED: "PACKAGED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
};
export const STATUS_ORDER_ITEM_VI = {
  NEW: "Mới",
  CONFIRM: "Xác nhận",
  ORDERING: "Đặt hàng",
  RECEIVED: "Đã nhận",
  PACKAGED: "Đóng gói",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Huỷ",
};
export const STATUS_ORDER_ITEM_LEVEL = {
  NEW: 1,
  CONFIRM: 2,
  ORDERING: 3,
  RECEIVED: 4,
  PACKAGED: 5,
  COMPLETED: 6,
  CANCELLED: 7,
};
export const DEFAULT_DEBT_TYPE = "COD";
