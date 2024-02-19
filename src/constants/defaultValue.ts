export const BASE_URL = process.env.REACT_APP_BASE_URL;
// export const BASE_URL = 'http://192.168.77.157:8555';
export const DEFAULT_UPLOAD_ACTION = `${BASE_URL}/api/v1/file`;
export const MAX_UPLOAD_FILE_SIZE_IN_MB = 2;


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

export const MAX_LIMIT = 200;
export const NEW_BILL_EMAIL = 'newBillEmail';
export const STATUS_BILL_EMAIL = 'statusBillEmail';
export const NEW_QUOTATION_EMAIL = 'newQuotationEmail';

export type ValueStatusTask = {
    value?: string;
    bg?: string;
    color?: string;
    name?: string;
}
export type TASK_ITEM_STATUS_NAME = {
  'NEW': ValueStatusTask;
  'CONFIRMED': ValueStatusTask;
  'IN_PROGRESS': ValueStatusTask;
  'COMPLETED': ValueStatusTask;
  'ON_HOLD': ValueStatusTask;
  'REJECTED': ValueStatusTask;
};

export type TaskItemStatusKey = 'NEW' | 'CONFIRMED' | 'IN_PROGRESS' | 'COMPLETED' | 'ON_HOLD' | 'REJECTED';

export const TASK_ITEM_STATUS_NAME : any = {
  NEW: {
    value: 'Mới',
    bg: '#1198AD',
    color: 'white',
    name: 'NEW',
  },
  CONFIRMED: {
    value: 'Đã xác nhận',
    bg: '#42496F',
    color: 'white',
    name: 'CONFIRMED',
  },
  IN_PROGRESS: {
    value: 'Đang thực hiện',
    bg: '#70E85D',
    color: 'black',
    name: 'IN_PROGRESS',
  },
  COMPLETED: {
    value: 'Đã hoàn thành',
    bg: '#FFEA00',
    color: 'black',
    name: 'COMPLETED',
  },
  ON_HOLD: {
    value: 'Đang chờ',
    bg: '#FF6200',
    color: 'black',
    name: 'ON_HOLD',
  },
  REJECTED: {
    value: 'Từ chối',
    bg: '#DEE2E6',
    color: 'black',
    name: 'REJECTED',
  },
};
export const TASK_ITEM_PRIORITY = {
  LOW: 'LOW',
  NORMAL: 'NORMAL',
  HIGH: 'HIGH',
  IMMEDIATE: 'IMMEDIATE',
};
export const TASK_ITEM_PRIORITY_NAME = {
  LOW: 'Thấp',
  NORMAL: 'Trung bình',
  HIGH: 'Cao',
  IMMEDIATE: 'Ngay lập tức',
};

export const HISTORY_TASK_ITEM_TYPE: any = {
  assignUser: 'thêm thành viên',
  status: 'thay đổi trạng thái',
  description: 'ghi chú',
  progressList: 'danh sách công việc',
  'progressList.check': 'trạng thái công việc',
  'progressList.content': 'nội dung công việc',
  'progressList.assgin': 'chỉ định công việc',
};

export const TASK_ITEM_TYPE_REQUEST = {
  add: 'add',
  remove: 'remove',
};

export const INFINITY = 999999999999; // 12
