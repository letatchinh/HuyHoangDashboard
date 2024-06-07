import { TRANSPORT_NAME_TYPE, TRANSPORT_TYPE_OBJECT, payerTypeOption, transportUnitType } from "./logistic.modal";

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

export const serviceViettelPost = [
  {
    value: "VCN",
    label: "VCN Chuyển phát nhanh",
  },
  {
    value: "VTK",
    label: "VTK Tiết kiệm",
  },
  {
    value: "V60",
    label: "V60 Dịch vụ Nhanh 60h",
  },
  {
    value: "VVT",
    label: "VVT Dịch vụ vận tải",
  },
  {
    value: "VHT",
    label: "VHT Phát Hỏa tốc",
  },
  {
    value: "SCOD",
    label: "SCOD Giao hàng thu tiền",
  },
  {
    value: "PTN",
    label: "PTN Phát trong ngày nội tỉnh",
  },
  {
    value: "PHT",
    label: "PHT Phát hỏa tốc nội tỉnh",
  },
  {
    value: "PHS",
    label: "PHS Phát hôm sau nội tỉnh",
  },
  {
    value: "VBS",
    label: "VBS Nhanh theo hộp",
  },
  {
    value: "VBE",
    label: "VBE Tiết kiệm theo hộp",
  }
];

export const typeSent = [
  {
    label: "Thu gom tận nơi",
    value: "TGTN",
  },
  {
    label: "Gửi hàng tại bưu cục",
    value: "GHBC",
  },
];
export const transportUnit : transportUnitType[] = [
  {
    label: "Bưu điện Việt Nam",
    value: "VIETNAMPOST",
  },
  {
    label: "Viettel Post",
    value: "VIETTELPOST",
  },
];

export const TRANSPORT_NAME = {
  VIETNAMPOST: 'VIETNAMPOST',
  VIETTELPOST: 'VIETTELPOST'
};

export const ADDON_SERVICE = { 
  VIETTELPOST: "SCOD",
  VIETNAMPOST: "GTG071",
} //Thu hộ phí ship;


export const PAYER_OPTIONS : payerTypeOption[] = [
  { label: "Công ty", value: "SYSTEM" },
  { label: "Khách hàng", value: "CUSTOMER" },
];