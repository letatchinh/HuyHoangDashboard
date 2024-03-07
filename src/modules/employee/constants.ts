import { getOptions } from "~/utils/helpers";

export const STAFF_LEVEL = {
  LEADER: "LEADER",
  TDV: "TDV",
  ASM: "ASM",
  CTV: "CTV",
};
export const STAFF_LEVEL_VI = {
  LEADER: "Trưởng nhóm bán hàng",
  TDV: "Trình dược viên",
  ASM: "Quản lý vùng",
  CTV: "Cộng tác viên",
};
export const STAFF_LEVEL_OPTIONS = getOptions(STAFF_LEVEL_VI);
