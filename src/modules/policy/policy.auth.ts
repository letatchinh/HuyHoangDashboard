// import { userGroup } from '~/modules/userGroup';
import { concat, forIn, get } from 'lodash';
import { PoliciesType, ResourceType } from './policy.modal';

const branch = 'branch';
const company = 'company';
const employee = 'employee';
const user = 'user';
const userGroup = 'userGroup';
const pharmacy = 'pharmacy';
const configDiscount = 'configDiscount';
const pharmaProfile = 'pharmaProfile';
const notificationBotManager = 'notificationBotManager';


// Đơn hàng
const bill = 'bill';
const manuFacturer = 'manufacturer';
const unit = 'unit';
const productGroup='productGroup';
const ranking = 'ranking';
const medicine = 'medicine';

// Đơn hàng tạm
const quotation = 'quotation';
// Nhà cung cấp
const supplier = 'supplier';
const debt = 'debt';

// Sản phẩm Nhà cung cấp
const product = 'product';
const todoConfigStatus = 'todoConfigStatus';
const todoList = 'todoList';
const voucher = 'voucher';
const statusVoucher = 'statusVoucher';
const historyVoucher = 'historyVoucher';

const revenueSupplier = 'revenueSupplier';

const RESOURCES = [
  //Setting
  configDiscount,

  //User
  branch,
  // company,
  employee,
  user,
  userGroup,


  // pharmacy,
  manuFacturer,
  unit,
  ranking,
  // productGroup
  productGroup,
  //
  medicine,
  supplier,
  product,

  //VOUCHER
  voucher,
  statusVoucher,
  historyVoucher,
  supplier,
  product,
  debt,

  // Pharmacy Profile
  pharmaProfile,
  
  bill,
  quotation,
  // Bot Notification
  notificationBotManager,
  todoConfigStatus,
  todoList,

  medicine,
  revenueSupplier,
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
    employee
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
    voucher,
    statusVoucher,
    historyVoucher
  ]

  const PHARMA_PROFILE: string[] = [
    pharmaProfile
  ];
  
  const GROUP_BILL : string[] = [
    bill,
    quotation,
  ];

  const NOTIFICATION_BOT_MANAGER: string[] = [
    notificationBotManager
  ]
  
  const GROUP_SUPPLIER: string[] = [
    supplier,
    product,
    debt,
    revenueSupplier,
  ];
  
  const GROUP_WORK_MANAGERMENT: string[] = [
    todoList,
    todoConfigStatus,
  ];


   const GROUP_MEDICINE: string[] = [
    medicine
  ]
  return {
    GROUP_USER,
    GROUP_EMPLOYEE,
    GROUP_WHSETTING,
    GROUP_MANUFACTURER,
    UNIT,
    GROUP_PRODUCTGROUP,
    GROUP_RANKING,
    MEDICINE,
    PHARMA_PROFILE,
    GROUP_BILL,
    NOTIFICATION_BOT_MANAGER,
    GROUP_SUPPLIER,
    GROUP_WORK_MANAGERMENT,
    GROUP_VOUCHER,
    GROUP_MEDICINE,
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

