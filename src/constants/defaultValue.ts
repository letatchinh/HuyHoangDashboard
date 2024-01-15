// export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const BASE_URL = "http://192.168.77.157:8555"; // Dat
// export const BASE_URL = "http://192.168.77.129:7006"; // Cuong

export const DEFAULT_UPLOAD_ACTION = `${BASE_URL}/api/v1/file`;
export const MAX_UPLOAD_FILE_SIZE_IN_MB = 2;

export const MAX_LIMIT = 200;

export const DEFAULT_BRANCH_ID = 99999;
export const STATUS = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const STATUS_NAMES = {
  ACTIVE: "Hoạt động",
  INACTIVE: "Ngưng hoạt động",
};
export const ACTIONS_REDUX = ['read', 'write', 'update', 'delete', 'admin', 'download'];
export interface OptionSelect {
  value: string | null;
  label: string;
};
export const OptionStatus : OptionSelect[] = [
  {
    value:  null,
    label: 'TC',
  },
  {
    value: 'ACTIVE',
    label: 'HĐ',
  },
  {
    value: 'INACTIVE',
    label: 'KHĐ',
  }
];
