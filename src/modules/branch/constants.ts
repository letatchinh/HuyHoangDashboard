import { STATUS_LINK_WAREHOUSE_TYPE, STATUS_LINK_WAREHOUSE_TYPE_VI } from "./branch.modal";

export const STATUS_LINK_WAREHOUSE_EN : STATUS_LINK_WAREHOUSE_TYPE= {
  LINKED: "LINKED",
  NOT_LINKED: "NOT_LINKED",
};

export const STATUS_LINK_WAREHOUSE_VI = {
  [STATUS_LINK_WAREHOUSE_EN.LINKED]:  { name: 'Đã liên kết', color: 'geekblue',colorStyle : '#1d39c4' },
  [STATUS_LINK_WAREHOUSE_EN.NOT_LINKED]: { name: 'Chưa liên kết', color: 'processing',colorStyle : '#1890ff' },
};
