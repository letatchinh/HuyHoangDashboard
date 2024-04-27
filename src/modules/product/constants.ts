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

export const STATUS_VOUCHER_BORROW_VI : any = {
  PROCESSING: 'Đang mượn',
  COMPLETED: 'Đã trả',
};