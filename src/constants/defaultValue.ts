import { get } from "lodash";
import { devConfig } from "~/config";
import { getOptions } from "~/utils/helpers";



export const BASE_URL = "http://14.225.217.10:8099/";
export const DEFAULT_UPLOAD_ACTION = `${BASE_URL}/api/v1/file`;
export const MAX_UPLOAD_FILE_SIZE_IN_MB = 1;

export const DEFAULT_BRANCH_ID = 99999;
export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const STATUS_NAMES = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Ngưng hoạt động",
};

export const STATUS_COLOR = {
  ACTIVE: "success",
  INACTIVE: "default",
};

export const ACTIONS_REDUX = ['read', 'write', 'update', 'delete', 'admin', 'download'];
export interface OptionSelect {
  value: string | null;
  label: string;
};
export const OptionStatus : OptionSelect[] = [
  {
    value:  null,
    label: 'Tất cả',
  },
  {
    value: 'ACTIVE',
    label: 'Hoạt động',
  },
  {
    value: 'INACTIVE',
    label: 'Không hoạt động',
  }
];


export const COMPONENT_MODES = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  CREATE: 'CREATE'
};


export const requireRules: any = [
  {
      required : true,
      message : "Vui lòng nhập!"
  }
];
export const requireRulesCustom = (mess ? : string) => [
  {
      required : true,
      message : mess ?? "Vui lòng nhập!"
  }
]