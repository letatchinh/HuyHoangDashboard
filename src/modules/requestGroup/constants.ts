
export const STATUS_REQUEST_GROUP = {
    NEW: "NEW",
    PROCESSING: "PROCESSING",
    COMPLETED: "COMPLETED",
    CANCELLED: "CANCELLED",
  } as const;
  export const STATUS_REQUEST_GROUP_VI = {
    NEW: "Đã tiếp nhận",
    PROCESSING: "Đang xử lý",
    COMPLETED: "Đã hoàn thành",
    CANCELLED: "Đã huỷ",
  } as const;

  export const STATUS_REQUEST_GROUP_COLOR = {
    NEW : "default",
    PROCESSING : "processing",
    COMPLETED : "success",
    CANCELLED : "error",
  } as const;
