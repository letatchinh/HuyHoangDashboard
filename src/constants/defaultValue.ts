export const BASE_URL = process.env.REACT_APP_BASE_URL ?? 'https://pharma-dashboard.congtyso.com';
// export const BASE_URL = 'http://192.168.77.129:7007';

export const DEFAULT_UPLOAD_ACTION = `${BASE_URL}/api/v1/file`;
export const MAX_UPLOAD_FILE_SIZE_IN_MB = 2;

export const DEFAULT_BRANCH_ID = 99999;
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