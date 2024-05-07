export const PRODUCT_TYPE = {
  exclusive: "exclusive",
  agency: "agency",
  wholesale: 'wholesale',
  retail: 'retail',
} as const;
export const PRODUCT_TYPE_VI = {
  exclusive: "Độc quyền",
  agency: "Đại lý",
  wholesale: 'Sản phẩm bán buôn',
  retail: 'Sản phẩm bán lẻ',
} as const;

export const SALE_LEVEL = {
  CORE : "CORE",
  NORMAL : "NORMAL",
  LOW : "LOW",
}
export const SALE_LEVEL_VI = {
  CORE : "Hàng chủ lực",
  NORMAL : "Hàng thị trường",
  LOW : "Hàng bán chậm",
}

export const REF_TYPE_OBJECT : any= {
  PARTNER: 'Cộng tác viên',
  EMPLOYEE: 'Trình dược viên',
};

export const STATUS_VOUCHER_BORROW : any = {
  PROCESSING: 'PROCESSING',
  COMPLETED: 'COMPLETED',
};

export const STATUS_VOUCHER_BORROW_EN: any = {
  NEW: 'NEW',
  PROCESSING: 'PROCESSING',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
};
export const LANGUAGE: any = {
  VI: 'vi',
  EN: 'en'
};
export const STATUS_VOUCHER_BORROW_NAME: any = {
  [STATUS_VOUCHER_BORROW_EN.NEW]: {
    [LANGUAGE.VI]: 'Mới'
  },
  [STATUS_VOUCHER_BORROW_EN.PROCESSING]: {
    [LANGUAGE.VI]: 'Xác nhận mượn'
  },
  [STATUS_VOUCHER_BORROW_EN.CANCELLED]: {
    [LANGUAGE.VI]: 'Từ chối'
  },
  [STATUS_VOUCHER_BORROW_EN.COMPLETED]: {
    [LANGUAGE.VI]: 'Hoàn trả'
  },
};
export const STATUS_VOUCHER_BORROW_NAME_ROOT: any = {
  [STATUS_VOUCHER_BORROW_EN.NEW]: {
    [LANGUAGE.VI]: 'Mới'
  },
  [STATUS_VOUCHER_BORROW_EN.PROCESSING]: {
    [LANGUAGE.VI]: 'Đang mượn'
  },
  [STATUS_VOUCHER_BORROW_EN.CANCELLED]: {
    [LANGUAGE.VI]: 'Từ chối'
  },
  [STATUS_VOUCHER_BORROW_EN.COMPLETED]: {
    [LANGUAGE.VI]: 'Đã hoàn trả'
  },
};

export const STATUS_VOUCHER_BORROW_VI : any = {
  PROCESSING: 'Đang mượn',
  COMPLETED: 'Đã trả',
};

