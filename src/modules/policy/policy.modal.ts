import { PoliciesRuleType } from "./policy.rule";

export type TypeProps = {};
const ResourceTypeRule = {
  GROUP_USER:'GROUP_USER',
  GROUP_EMPLOYEE:'GROUP_EMPLOYEE',
  GROUP_WHSETTING:'GROUP_WHSETTING',
  GROUP_MANUFACTURER:'GROUP_MANUFACTURER',
  UNIT:'UNIT',
  GROUP_PRODUCTGROUP:'GROUP_PRODUCTGROUP',
  GROUP_RANKING:'GROUP_RANKING',
  MEDICINE:'MEDICINE',
  GROUP_PHARMA:'GROUP_PHARMA',
  PHARMA_PROFILE:'PHARMA_PROFILE',
  // Đơn hàng
  GROUP_BILL:'GROUP_BILL',
  NOTIFICATION_BOT_MANAGER:'NOTIFICATION_BOT_MANAGER',
  GROUP_SUPPLIER:'GROUP_SUPPLIER',
  GROUP_WORK_MANAGERMENT:'GROUP_WORK_MANAGERMENT',
  GROUP_VOUCHER:'GROUP_VOUCHER',
  GROUP_MEDICINE:'GROUP_MEDICINE',
  GROUP_SHIPPINGCOST:'GROUP_SHIPPINGCOST',
  GROUP_REPORT:'GROUP_REPORT',
  // Kênh bán hàng
  SALES_CHANNEL:'SALE_CHANNEL',
  // Loại nhà thuốc
  CUSTOMER_GROUP:'CUSTOMER_GROUP',
  // Nhóm nhà thuốc
  CUSTOMER:'CUSTOMER',
};

type newType =  typeof ResourceTypeRule

export type ResourceType = { [ key in keyof newType] : string[]}

export type policyType =
  | "write"
  | "read"
  | "update"
  | "delete"
  | "download"
  | "admin";

export type PoliciesType = {
  [key in PoliciesRuleType]: [string, policyType];
};
