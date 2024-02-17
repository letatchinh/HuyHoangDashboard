import { get } from "lodash";
import { devConfig } from "~/config";

// export const BASE_URL = get(devConfig,'baseUrl');
export const BASE_URL = 'https://pharma-dashboard.congtyso.com';
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

export const WH_PAYMENT_METHOD = {
  COD: 'COD',
  TRANSFER: 'TRANSFER'
};

export const WH_PAYMENT_METHOD_VI = {
  COD: 'Tiền mặt',
  TRANSFER: 'Chuyển khoản'
};

export const COMPONENT_MODES = {
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  CREATE: 'CREATE'
};

export const REF_COLLECTION_UPPER : any= {
  BILL: 'BILL',
  BILLITEM: 'BILLITEM',
  PHARMA_PROFILE: 'PHARMA_PROFILE',
  SUPPLIER: 'SUPPLIER',
};

export const REF_COLLECTION : any= {
  BILL: 'bill',
  BILLITEM: 'billItem',
  PHARMA_PROFILE: 'pharma_profile',
  SUPPLIER: 'supplier',
};

export const TYPE_VOUCHER = {
  PT: 'PT',
  PC: 'PC',
};

export const WH_VOUCHER_STATUS = {
  CREATED: 'CREATED',
  CONFIRMED: 'CONFIRMED',
  APPROVED: 'APPROVED',
  REJECT: 'REJECT',
  CUSTOMER_CANCEL: 'CUSTOMER_CANCEL',
};
export const STATUS_VOUCHERS_VI = {
  CREATED: 'Mới',
  CONFIRMED: 'Đã xác nhận',
  APPROVED: 'Đã duyệt',
  REJECT: 'Đã từ chối',
  CUSTOMER_CANCEL: 'Đã chấm dứt',
};
export const LANGUAGE = {
  VI: 'vi',
  EN: 'en'
};
export const WH_VOUCHER_ACTION_NAME = {
  [WH_VOUCHER_STATUS.CONFIRMED]: {
    [LANGUAGE.VI]: 'Xác nhận'
  },
  [WH_VOUCHER_STATUS.APPROVED]: {
    [LANGUAGE.VI]: 'Duyệt'
  },
  [WH_VOUCHER_STATUS.REJECT]: {
    [LANGUAGE.VI]: 'Từ chối'
  },
  [WH_VOUCHER_STATUS.CREATED]: {
    [LANGUAGE.VI]: 'Mới'
  },
  [WH_VOUCHER_STATUS.CUSTOMER_CANCEL]: {
    [LANGUAGE.VI]: 'Đã chấm dứt'
  },
};

export const MAP_STATUS_VOUCHERS_VI = {
  [WH_VOUCHER_STATUS.CREATED]: { name: 'Mới', color: 'geekblue',colorStyle : '#1d39c4' },
  [WH_VOUCHER_STATUS.CONFIRMED]: { name: 'Đã xác nhận', color: 'processing' ,colorStyle : '#1890ff'},
  [WH_VOUCHER_STATUS.APPROVED]: { name: 'Đã duyệt', color: 'success',colorStyle : '#52c41a' },
  [WH_VOUCHER_STATUS.REJECT]: { name: 'Đã từ chối', color: 'error',colorStyle : '#f5222d' },
  [WH_VOUCHER_STATUS.CUSTOMER_CANCEL]: { name: 'Đã chấm dứt', color: 'default',colorStyle : 'rgba(0, 0, 0, 0.85)' },
};

export const WH_VOUCHER_CODE_PREFIX = {
  [TYPE_VOUCHER.PT]: 'PT',
  [TYPE_VOUCHER.PC] : 'PC'
};

export const ORDER_STATUS: any  = {
  ORDERING: 'ORDERING',
  ORDERED: 'ORDERED',
  RECEIVED: 'RECEIVED',
  PROCESSING: 'PROCESSING',
  CONFIRMED: 'CONFIRMED',
  PACKAGED: 'PACKAGED',
  SHIPPING: 'SHIPPING',
  COMPLETED: 'COMPLETED',
  CANCELLED: 'CANCELLED'
};
export const ORDER_STATUS_KEY_SEARCH_COLOR : any = {
  [ORDER_STATUS.ORDERING]: { name: 'Đang đặt hàng', color: '#4CB9E7',colorStyle: '#4CB9E7' },
  [ORDER_STATUS.ORDERED]: { name: 'Đã đặt hàng', color: '#eee952',colorStyle: '#eee952' },
  [ORDER_STATUS.RECEIVED]: { name: 'Đã tiếp nhận', color: '#242ddf',colorStyle: '#242ddf' },
  [ORDER_STATUS.PROCESSING]: { name: 'Đang xử lý', color: '#249451',colorStyle: '#249451' },
  [ORDER_STATUS.CONFIRMED]: { name: 'Đã xác nhận', color: '#ce8217',colorStyle: '#ce8217' },
  [ORDER_STATUS.PACKAGED]: { name: 'Đã đóng gói', color: '#e03bae',colorStyle: '#e03bae' },
  [ORDER_STATUS.SHIPPING]: { name: 'Đang giao', color: '#e0a98c',colorStyle: '#e0a98c' },
  [ORDER_STATUS.COMPLETED]: { name: 'Đã nhận', color: '#60d308',colorStyle: '#60d308' },
  [ORDER_STATUS.CANCELLED]:{ name: 'Đã huỷ', color: '#f5222d',colorStyle: '#f5222d' },
};

export const ACCOUNTS : any = {
  1111: 'Tiền Việt Nam ',
  1112: 'Ngoại tệ',
  1121: 'Tiền Việt Nam ',
  1122: 'Ngoại tệ',
  121: 'Chứng khoán kinh doanh',
  1281: 'Tiền gửi có kỳ hạn',
  1288: 'Đầu tư nắm giữ đến ngày đáo hạn',
  131: 'Phải thu của khách hàng',
  1331: 'Thuế GTGT được khấu trừ của hàng hóa; dịch vụ ',
  1332: 'Thuế GTGT được khấu trừ của TSCĐ',
  1361: 'Vốn kinh doanh ở đơn vị trực thuộc ',
  1368: 'Phải thu nội bộ khác',
  1381: 'Tài sản thiếu chờ xử lý',
  1386: 'Cầm cố; thế chấp; ký quỹ; ký cược',
  1388: 'Phải thu khác',
  141: 'Tạm ứng',
  151: 'Hàng mua đang đi đường',
  152: 'Nguyên liệu; vật liệu',
  153: 'Công cụ; dụng cụ',
  154: 'Chi phí sản xuất; kinh doanh dở dang',
  155: 'Thành phẩm',
  156: 'Hàng hóa',
  157: 'Hàng gửi đi bán',
  21111: 'Nhà cửa; vật kiến trúc',
  21112: 'Máy móc thiết bị',
  21113: 'Phương tiện vận tải; truyền dẫn',
  21114: 'Thiết bị dụng cụ quản lý',
  21115: 'Cây lâu năm; súc vật làm việc và cho sản phẩm',
  21116: 'Các TSCĐ là kết cấu hạ tầng; có giá trị',
  21118: 'TSCĐ khác',
  2112: 'TSCĐ thuê tài chính ',
  21131: 'Quyền sử dụng đất',
  21132: 'Quyền phát hành',
  21133: 'Bản quyền; bằng sáng chế',
  21134: 'Nhãn hiệu hàng hoá',
  21135: 'Phần mềm máy vi tính',
  21136: 'Giấy phép và giấy chuyển nhượng quyền ',
  21138: 'TSCĐ vô hình khác',
  2141: 'Hao mòn TSCĐ hữu hình',
  2142: 'Hao mòn TSCĐ thuê tài chính',
  2143: 'Hao mòn TSCĐ vô hình',
  2147: 'Hao mòn bất động sản đầu tư',
  217: 'Bất động sản đầu tư',
  2281: 'Đầu tư vào công ty liên doanh; liên kết',
  2288: 'Đầu tư khác ',
  2291: 'Dự phòng giảm giá chứng khoán kinh doanh',
  2292: 'Dự phòng tổn thất đầu tư vào đơn vị khác',
  2293: 'Dự phòng phải thu khó đòi',
  2294: 'Dự phòng giảm giá hàng tồn kho',
  2411: 'Mua sắm TSCĐ',
  2412: 'Xây dựng cơ bản',
  2413: 'Sửa chữa lớn TSCĐ',
  242: 'Chi phí trả trước',
  331: 'Phải trả cho người bán',
  33311: 'Thuế GTGT đầu ra',
  33312: 'Thuế GTGT hàng nhập khẩu',
  3332: 'Thuế tiêu thụ đặc biệt',
  3333: 'Thuế xuất; nhập khẩu',
  3334: 'Thuế thu nhập doanh nghiệp',
  3335: 'Thuế thu nhập cá nhân',
  3336: 'Thuế tài nguyên',
  3337: 'Thuế nhà đất; tiền thuê đất',
  33381: 'Thuế bảo vệ môi trường',
  33382: 'Các loại thuế khác',
  3339: 'Phí; lệ phí và các khoản phải nộp khác',
  334: 'Phải trả người lao động',
  335: 'Chi phí phải trả',
  3361: 'Phải trả nội bộ về vốn kinh doanh',
  3368: 'Phải trả nội bộ khác',
  3381: 'Tài sản thừa chờ giải quyết',
  3382: 'Kinh phí công đoàn',
  3383: 'Bảo hiểm xã hội',
  3384: 'Bảo hiểm y tế',
  3385: 'Bảo hiểm thất nghiệp',
  3386: 'Nhận ký quỹ; ký cược',
  3387: 'Doanh thu chưa thực hiện',
  3388: 'Phải trả; phải nộp khác',
  3411: 'Các khoản đi vay ',
  3412: 'Nợ thuê tài chính',
  3521: 'Dự phòng bảo hành sản phẩm hàng hoá',
  3522: 'Dự phòng bảo hành công trình xây dựng',
  3524: 'Dự phòng phải trả khác',
  3531: 'Quỹ khen thưởng',
  3532: 'Quỹ phúc lợi',
  3534: 'Quỹ thưởng ban quản lý điều hành công ty',
  3561: 'Quỹ phát triển khoa học và công nghệ',
  3562: 'Quỹ phát triển khoa học và công nghệ',
  4111: 'Vốn góp của chủ sỡ hữu',
  4112: 'Thặng dư vốn cổ phần',
  4118: 'Vốn khác ',
  413: 'Chênh lệch tỷ giá hối đoái',
  418: 'Các quỹ thuộc vốn chủ sỡ hữu',
  419: 'Cổ phiếu quỹ',
  4211: 'Lợi nhuận sau thuế chưa phân phối năm trước',
  4212: 'Lợi nhuận sau thuế chưa phân phối năm nay',
  5111: 'Doanh thu bán hàng hoá',
  5113: 'Doanh thu cung cấp dịch vụ',
  5118: 'Doanh thu khác',
  515: 'Doanh thu hoạt động tài chính',
  611: 'Mua hàng',
  632: 'Giá vốn hàng bán',
  635: 'Chi phí tài chính',
  6421: 'Chi phí bán hàng',
  6422: 'Chi phí quản lý doanh nghiệp',
  711: 'Thu nhập khác',
  811: 'Chi phí khác',
  821: 'Chi phí thuế thu nhập doanh nghiệp',
  911: 'Xác định kết quả kinh doanh '
};
export const MAX_LIMIT = 200;
