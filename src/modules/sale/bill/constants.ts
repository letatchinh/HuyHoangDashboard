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

export const serviceLogistic = [
  {
    title: 'Tiết kiệm	',
    label: 'Tiết kiệm	',
    options: [
      {
        label: 'Tài liệu, hàng hóa tiêu chuẩn',
        value: 'CTN001',
      },
      {
        label: 'Thương mại điện tử tiêu chuẩn',
        value: 'CTN007',
      },
    ]
  },
  {
    title: 'Tiêu chuẩn',
    label: 'Tiêu chuẩn',
    options: [
      {
        label: 'Thương mại điện tử đồng giá tiêu chuẩn',
        value: 'CTN009',
      },
    ]
  },
  {
    title: 'Nhanh',
    label: 'Nhanh',
    options: [
      {
        label: 'Tài liệu, hàng hóa nhanh',
        value: 'ETN011',
      },
      {
        label: 'Thương mại điện tử nhanh',
        value: 'ETN031',
      },
      {
        label: 'Thương mại điện tử đồng giá nhanh',
        value: 'ETN037',
      },
    ]
  },
  {
    title: 'Hoả tốc',
    label: 'Hoả tốc',
    options: [
      {
        label: 'Hỏa tốc',
        value: 'ETN013',
      },
    ]
  },
  {
    title: 'Hàng nặng',
    label: 'Hàng nặng',
    options: [
      {
        label: 'Logistic Eco (từ 30kg) hàng nặng',
        value: 'PTN001',
      },
    ]
  },
];