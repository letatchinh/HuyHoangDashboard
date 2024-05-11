import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface typeNotification {
  ORDER_CONVERT_QUOTATION_CUSTOMER: string;
  ORDER_QUOTATION_CUSTOMER: string;
  ORDER_SUPPLIER: string;
}
export const TYPE_NOTIFICATION : any = {
  ORDER_CONVERT_QUOTATION_CUSTOMER: "ORDER_CONVERT_QUOTATION_CUSTOMER",
  ORDER_QUOTATION_CUSTOMER: "ORDER_QUOTATION_CUSTOMER",
  ORDER_SUPPLIER: "ORDER_SUPPLIER",
};

export const STATUS_READ = {
  unread:'unread',
  read:'read',
}
export const STATUS_READ_VI = {
  unread:'Chưa đọc',
  read:'Đã đọc',
}

export const TYPE_NOTIFICATION_ICON : any = {
  ORDER_CONVERT_QUOTATION_CUSTOMER: '',
  ORDER_QUOTATION_CUSTOMER:'',
  ORDER_SUPPLIER:'',
};
export const zIndexHeader = 2000;
