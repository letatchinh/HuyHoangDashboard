// import { userGroup } from '~/modules/userGroup';
import { concat, forIn, get } from 'lodash';
import { PoliciesType, ResourceType } from './policy.modal';

const branch = 'branch';
const company = 'company';
const employee = 'employee';
const employeePosition = 'employeePosition'; //Key position for staff is seller 
const employeeGroup = 'employeeGroup';
const user = 'user';
const userGroup = 'userGroup';
const pharmacy = 'pharmacy';
const configDiscount = 'configDiscount';
const notificationBotManager = 'notificationBotManager';
const shippingCost = 'shippingCost';

//Pharmacy
const pharmaProfile = 'pharmaProfile';
const contractPharmacy = 'contractPharmacy';
const debtPharmacy = 'debtPharmacy';
const accumulatePharmaProfile = 'accumulatePharmaProfile';
const billPharmacy = 'billPharmacy';

// Đơn hàng
const bill = 'bill';
const manuFacturer = 'manufacturer';
const unit = 'unit';
const productGroup='productGroup';
const ranking = 'ranking';
const medicine = 'medicine';
const historyBillPharma = 'historyBillPharma';
const billPartner = 'billPartner';
const billEmployee = 'billEmployee';

// Đơn hàng tạm
const quotation = 'quotation';
const quotationPartner = 'quotationPartner';
const quotationEmployee = 'quotationEmployee';
const quotationPharmacy = 'quotationPharmacy';
// Nhà cung cấp
const supplier = 'supplier';
const cumulativeSalesSupplier = 'cumulativeSalesSupplier';
const debtSupplier = 'debtSupplier';
const orderSupplierStatus = 'orderSupplierStatus';

// Sản phẩm Nhà cung cấp
const product = 'product';
const todoConfigStatus = 'todoConfigStatus';
const todoList = 'todoList';
const voucherPharmacy = 'voucherPharmacy';
const voucherSupplier = 'voucherSupplier';
const statusVoucher = 'statusVoucher';
const historyVoucher = 'historyVoucher';
const voucherSalaryEmployee = 'voucherSalaryEmployee';

const revenueSupplier = 'revenueSupplier';
const historySupplierMineral = 'historySupplierMineral';
// Quản lý luỹ kế
const cumulativeEvent = 'cumulativeEvent';

const salesGroup = 'salesGroup';
// Báo cáo
const reportSalary = 'reportSalary';
const configBaseSalary = 'configBaseSalary';
const configCronTime = 'configCronTime';
const configBenefit = 'configBenefit';

// Đơn hàng nhà cung cấp
const orderSupplier = 'orderSupplier';

// Thời gian báo cáo lương
const configReportSalaryAuto = 'configReportSalaryAuto';
// Kênh bán hàng
const salesChannel ='salesChannel';

// Loại nhà thuốc
const customerGroup = 'customerGroup';

// Nhóm nhà thuốc
const customer = 'customer';

// Cập nhật Nhà thuốc đảm nhiệm cho nhân viên
const updateThePharmacyForEmployee = 'updateThePharmacyForEmployee';

// Cộng tác viên
const partner = 'partner';
const partnerGroup = 'partnerGroup';
const reportSalaryPartner = 'reportSalaryPartner';
const voucherSalaryPartner = 'voucherSalaryPartner';
const voucherBillPartner = 'voucherBillPartner';

const voucherPartner = 'voucherPartner';
const borrowProduct = 'borrowProduct';
const statusBorrowProduct = 'statusBorrowProduct';
const reportProductSupplier = 'reportProductSupplier';
const reportOverview = 'reportOverview';
const requestChangeGroupCTV = 'requestChangeGroupCTV';
const requestChangeGroup = 'requestChangeGroup';
const warehouseLink = 'warehouseLink';
const logistic = 'logistic';
const billStatus = 'billStatus'; // Trạng thái đơn hàng bán
const billSpit = 'billSpit'; // Tách đơn hàng bán
const coupon = 'coupon'; // Tách đơn hàng bán

const reportOverviewB2B = 'reportOverviewB2B';
const reportOverviewB2C = 'reportOverviewB2C';
const reportRevenuePersonalEmployee = 'reportRevenuePersonalEmployee';
const reportRevenuePersonalPartner = 'reportRevenuePersonalPartner';
const reportRevenueTeamEmployee = 'reportRevenueTeamEmployee';
const reportRevenueTeamPartner = 'reportRevenueTeamPartner';

//------RESOURCES --------
const RESOURCES = [
  //Setting
  configDiscount,

  //User
  branch,
  // company,
  employee,
  employeePosition,
  employeeGroup,
  user,
  userGroup,


  // pharmacy,
  contractPharmacy,
  manuFacturer,
  unit,
  ranking,
  debtPharmacy,
  accumulatePharmaProfile,
  
  // productGroup
  productGroup,
  //
  medicine,
  product,
  historyBillPharma,
  
  //VOUCHER
  voucherPharmacy,
  voucherSupplier,
  statusVoucher,
  historyVoucher,
  voucherSalaryPartner,
  voucherSalaryEmployee,
  
  //Supplier
  cumulativeSalesSupplier,
  
  supplier,
  product,
  debtSupplier,
  orderSupplierStatus,

  // Pharmacy Profile
  pharmaProfile,
  
  // -----BILL---
  bill,
  billPartner,
  billEmployee,
  billPharmacy,
  billStatus,

  //------Quotation------
  quotation,
  quotationPartner,
  quotationEmployee,
  quotationPharmacy,
  
  // ------Bot Notification-----
  notificationBotManager,
  todoConfigStatus,
  todoList,

  revenueSupplier,
  historySupplierMineral,
  
  cumulativeEvent,
  orderSupplier,
  shippingCost,
  
  salesGroup,

  //Report
  reportSalary,
  configBaseSalary,
  configCronTime,
  configBenefit,
  
  salesChannel,
  customerGroup,
  customer,
  
  updateThePharmacyForEmployee,
  configReportSalaryAuto,

  //-----PARTNER------
  partner,
  partnerGroup,
  reportSalaryPartner,
  voucherSalaryPartner,
  voucherBillPartner,
  voucherPartner,
  borrowProduct,
  statusBorrowProduct,
  reportProductSupplier,
  reportOverview,
  requestChangeGroup,
  requestChangeGroupCTV,
  warehouseLink,
  logistic,
  billSpit,
  coupon,
  reportOverviewB2B,
  reportOverviewB2C,
  reportRevenuePersonalEmployee,
  reportRevenuePersonalPartner,
  reportRevenueTeamEmployee,
  reportRevenueTeamPartner,
];

//ACTIONS
const READ = 'read';
const WRITE = 'write';
const UPDATE = 'update';
const DELETE = 'delete';
const DOWNLOAD = 'download';
const ADMIN = 'admin';


export const ACTIONS = [READ, WRITE, UPDATE, DELETE, DOWNLOAD, ADMIN];


const POLICIES : PoliciesType = RESOURCES.reduce((policies, resource) => {
  const policy = ACTIONS.reduce(
    (actions, action) => ({
      ...actions,
      [`${action.toUpperCase()}_${resource.toUpperCase()}`]: [resource, action]
    }),
    {
      [resource.toUpperCase()]: [resource]
    }
  );

  return {
    ...policies,
    ...policy
  };
}, {} as PoliciesType);

export default POLICIES;
const RESOURCE = (): ResourceType => {
  const GROUP_WHSETTING: string[] = [
    configDiscount,
  ];
  
  const GROUP_USER : string[] = [
    user,
    userGroup
  ];
  const GROUP_EMPLOYEE : string[] = [
    employee,
    employeeGroup,
    employeePosition
  ];
  const GROUP_MANUFACTURER : string[] = [
    manuFacturer
  ];
  const UNIT : string[] = [
    unit
  ];
  const MEDICINE : string[] = [
    medicine
  ];
  const GROUP_PRODUCTGROUP : string[] = [
    productGroup
  ];
  const GROUP_RANKING : string[] = [
    ranking
  ];
  const GROUP_VOUCHER: string[] = [
    voucherSupplier,
    voucherPharmacy,
    statusVoucher,
    historyVoucher,
    voucherSalaryPartner,
    voucherSalaryEmployee,
  ]

  const GROUP_PHARMA: string[] = [
    pharmaProfile,
    contractPharmacy,
    voucherPharmacy,
    debtPharmacy
  ];
  
  const GROUP_BILL : string[] = [
    bill,
    quotation,
    billPartner,
    billEmployee,
    billPharmacy,
    quotationPartner,
    quotationEmployee,
    quotationPharmacy,
    logistic,
    billStatus,
    billSpit
  ];

  const NOTIFICATION_BOT_MANAGER: string[] = [
    notificationBotManager
  ]
  
  const GROUP_SUPPLIER: string[] = [
    supplier,
    product,
    revenueSupplier,
    historySupplierMineral,
    cumulativeSalesSupplier,
    voucherSupplier,
    debtSupplier,
    orderSupplierStatus,
  ];
  
  const GROUP_WORK_MANAGERMENT: string[] = [
    todoList,
    todoConfigStatus,
  ];


   const GROUP_MEDICINE: string[] = [
    medicine
  ];
  const GROUP_SHIPPINGCOST: string[] = [
    shippingCost
  ];

  const GROUP_REPORT: string[] = [
    reportSalary,
    configBaseSalary,
    configCronTime,
    configBenefit,
  ]
  const SALES_CHANNEL: string[] = [
    salesChannel
  ];

  const CUSTOMER_GROUP: string[] = [
    customerGroup
  ];

  const CUSTOMER: string[] = [
    customer
  ];

  const PHARMA_PROFILE: string[]= [
    pharmaProfile
  ];

  const PARTNER: string[] = [
    partner,
    partnerGroup,
    reportSalaryPartner,
  ];

  const VOUCHER_SALARY_PARTNER: string[] = [
    voucherSalaryPartner
  ];

  const VOUCHER_BILL_PARTNER: string[] = [
    voucherBillPartner,
  ];

  const GROUP_SETTING: string[] = [
    warehouseLink,
  ];
  const REPORT_OVERVIEW: string[] = [
    reportOverview,
  ];
  const REPORT_OVERVIEW_B2B : string[] = [
    reportOverviewB2B
  ];
  const REPORT_OVERVIEW_B2C : string[] = [
    reportOverviewB2B
  ];
  const REPORT_REVENUE_PERSONAL_EMPLOYEE : string [] = [
    reportRevenuePersonalEmployee
  ];
  const REPORT_REVENUE_PERSONAL_PARTNER : string [] = [
    reportRevenuePersonalPartner
  ];
  const REPORT_REVENUE_TEAM_EMPLOYEE : string [] = [
    reportRevenueTeamEmployee
  ];
  const REPORT_REVENUE_TEAM_PARTNER : string [] = [
    reportRevenueTeamPartner
  ];

  return {
    GROUP_USER,
    GROUP_EMPLOYEE,
    GROUP_WHSETTING,
    GROUP_MANUFACTURER,
    UNIT,
    GROUP_PRODUCTGROUP,
    GROUP_RANKING,
    MEDICINE,
    GROUP_PHARMA,
    GROUP_BILL,
    NOTIFICATION_BOT_MANAGER,
    GROUP_SUPPLIER,
    GROUP_WORK_MANAGERMENT,
    GROUP_VOUCHER,
    GROUP_MEDICINE,
    GROUP_SHIPPINGCOST,
    GROUP_REPORT,
    SALES_CHANNEL,
    CUSTOMER_GROUP,
    CUSTOMER,
    PHARMA_PROFILE,
    PARTNER,
    VOUCHER_SALARY_PARTNER,
    VOUCHER_BILL_PARTNER,
    GROUP_SETTING,
    REPORT_OVERVIEW,
    REPORT_OVERVIEW_B2B,
    REPORT_OVERVIEW_B2C,
    REPORT_REVENUE_PERSONAL_EMPLOYEE,
    REPORT_REVENUE_PERSONAL_PARTNER,
    REPORT_REVENUE_TEAM_EMPLOYEE,
    REPORT_REVENUE_TEAM_PARTNER,
  };
};

/**
 *
 * @param {String} action CORE_ACTION [READ, WRITE, UPDATE, DELETE]
 * @returns {Array} [POLICIES.action_resources]
 */
export const GROUP_POLICY : any = (action: any): void => {
  return forIn(RESOURCE(), (value, key, object : any) => {
    object[key] = [];
    // if (Array.isArray(value)) {
      value.forEach((keyPermission: string | undefined) => {
        if (keyPermission) {
          object[key].push(
            get(POLICIES, `${action}_${keyPermission.toUpperCase()}`)
          );
        }
      });
    // }
  });
};
export const CORE_ACTION = {
  READ: 'READ',
  WRITE: 'WRITE',
  UPDATE: 'UPDATE',
  DELETE: 'DELETE',
  ADMIN: 'ADMIN',
  DOWNLOAD: 'DOWNLOAD',
};

