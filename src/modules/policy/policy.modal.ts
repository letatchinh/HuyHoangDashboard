import { PoliciesRuleType } from "./policy.rule";

export type TypeProps = {};
export type ResourceType = {
  GROUP_USER: string[];
  GROUP_EMPLOYEE: string[];
  GROUP_WHSETTING: string[];
  GROUP_MANUFACTURER: string[];
  UNIT: string[];
  GROUP_PRODUCTGROUP: string[];
  GROUP_RANKING: string[];
  MEDICINE: string[];
  GROUP_PHARMA: string[];
  PHARMA_PROFILE: string[],
  // Đơn hàng
  GROUP_BILL: string[];
  NOTIFICATION_BOT_MANAGER: string[];
  GROUP_SUPPLIER: string[];
  GROUP_WORK_MANAGERMENT: string[];
  GROUP_VOUCHER: string[];
  GROUP_MEDICINE: string[];
  GROUP_SHIPPINGCOST: string[];
  GROUP_REPORT: string[];
  // Kênh bán hàng
  SALE_CHANNEL: string[];
  // Loại nhà thuốc
  TYPE_PHARMACY: string[];
  // Nhóm nhà thuốc
  GROUP_PHARMACY: string[];
};

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
