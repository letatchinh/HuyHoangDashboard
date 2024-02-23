import { STATUS_BILL_VI_TYPE, STATUS_BILL_TYPE, STATUS_SUPPLIER_TYPE } from "./supplier.modal";

export const STATUS_SUPPLIER : STATUS_SUPPLIER_TYPE = {
    ACTIVE : "ACTIVE",
    INACTIVE : "INACTIVE",
};

export const STATUS_BILL : STATUS_BILL_TYPE= {
    NEW: "NEW",
    PROCESSING: "PROCESSING",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
  };
  export const STATUS_BILL_VI : STATUS_BILL_VI_TYPE= {
    NEW: "Đã tiếp nhận",
    PROCESSING: "Đang xử lý",
    COMPLETED: "Đã hoàn thành",
    CANCELLED: "Đã huỷ",
  };
  