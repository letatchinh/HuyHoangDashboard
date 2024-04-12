import { getOptions } from "~/utils/helpers";

export const EMPLOYEE_LEVEL = {
  LEADER: "LEADER",
  TDV: "TDV",
  ASM: "ASM",
  CTV: "CTV",
  TEAMLEADER: 'TEAMLEADER'
};

export const EMPLOYEE_LEVEL_VI = {
  LEADER: "Trưởng nhóm bán hàng",
  TDV: "Trình dược viên",
  ASM: "Quản lý vùng",
  CTV: "Cộng tác viên",
};

export const EMPLOYEE_LEVEL_COLOR = {
  ASM: "magenta",
  LEADER: "purple",
  TDV: "blue",
  CTV: "Default",
};

export const EMPLOYEE_LEVEL_OPTIONS = getOptions(EMPLOYEE_LEVEL_VI);

export const TYPE_EMPLOYEE = {
  TDV: 'TDV',
  CTV: 'CTV',
};

export const TYPE_EMPLOYEE_VI = {
  TDV: 'Trình dược viên',
  CTV: 'Cộng tác viên',
};