
function path(root: any, sublink: any) {
  return `${root}${sublink}`;
}

const ROOTS = {
  auth: "/",
  app: "",
};
export const PATH_APP = {
  root: ROOTS.app,

  main: {
    root: path(ROOTS.app, "/dashboard"),
  },
  auth: {
    login: path(ROOTS.app, "/login"),
  },

  worldPharma: {
    productGroup: path(ROOTS.app, "/productGroup"),
    productGroupDetail: path(ROOTS.app, "/productGroup/:id"),
    manufacturer: path(ROOTS.app, "/manufacturer"),
    manufacturerDetail: path(ROOTS.app, "/manufacturer/:id"),
    ranking: path(ROOTS.app, "/ranking"),
    rankingDetail: path(ROOTS.app, "/ranking/:id"),
    unit: path(ROOTS.app, "/unit"),
    unitDetail: path(ROOTS.app, "/unit/:id"),
    medicine: path(ROOTS.app, "/medicine"),
  },

  supplier: {
    root: path(ROOTS.app, "/supplier"),
    revenue: path(ROOTS.app, "/supplier-revenue"),
  },
  revenueSupplier: {
    root: path(ROOTS.app, "/supplier-revenue"),
    revenue: path(ROOTS.app, "/supplier-revenue/:id"),
    revenueDetail: path(ROOTS.app, "/supplier-revenue/:id/detail/:revenueId"),
    revenueAll: path(ROOTS.app, "/supplier-revenue-all/:id"),
  },

  branch: {
    root: path(ROOTS.app, "/branch"),
  },

  product: {
    root: path(ROOTS.app, "/product"),
    edit: path(ROOTS.app, "/product/:supplierId"),
    borrow: path(ROOTS.app, "/product-borrow"),
  },
  todoList: {
    statusConfig: path(ROOTS.app, "/statusConfig"),
    workBoard: path(ROOTS.app, "/work-board"),
    workSprint: path(ROOTS.app, "/work-board/sprint/:boardId"),
    workList: path(ROOTS.app, "/work-board/detail/:sprintId"),
    workTask: path(ROOTS.app, "/work-task-item/:taskId"),
  },
  employee: {
    root: path(ROOTS.app, "/employee/*"),
    detail: path(ROOTS.app, "/employee-detail/:id"),
  },

  configDiscount: {
    root: path(ROOTS.app, "/config-discount"),
  },
  pharmacy: {
    root: path(ROOTS.app, "/pharmacy"),
    detail: path(ROOTS.app, "/pharmacy/:id"),
  },
  bill: {
    root: path(ROOTS.app, "/bill"),
    update: path(ROOTS.app, `/bill/:id`),
    create: path(ROOTS.app, "/bill/create"),
    quotation: path(ROOTS.app, "/quotation"),
    lk: path(ROOTS.app, "/lk"),

    pharmacy: path(ROOTS.app, `/bill-pharmacy`),
    employee: path(ROOTS.app, `/bill-employee`),
    collaborator: path(ROOTS.app, `/bill-collaborator`),

    createPharmacy: path(ROOTS.app, `/bill-pharmacy/create`),
    createEmployee: path(ROOTS.app, `/bill-employee/create`),
    createCollaborator: path(ROOTS.app, `/bill-collaborator/create`),

    updatePharmacy: path(ROOTS.app, `/bill-pharmacy/:id`),
    updateEmployee: path(ROOTS.app, `/bill-employee/:id`),
    updateCollaborator: path(ROOTS.app, `/bill-collaborator/:id`),
  },

  quotation: {
    root: path(ROOTS.app, "/quotation"),
    update: path(ROOTS.app, "/quotation/:id"),
    create: path(ROOTS.app, "/quotation/create"),
    
    pharmacy: path(ROOTS.app, `/quotation-pharmacy`),
    employee: path(ROOTS.app, `/quotation-employee`),
    collaborator: path(ROOTS.app, `/quotation-collaborator`),
  },
  vouchers: {
    root: path(ROOTS.app, "/vouchers"),
    supplier: path(ROOTS.app, "/vouchers-supplier"),
    pharmacy: path(ROOTS.app, "/vouchers-pharmacy"),
    salary: path(ROOTS.app, "/vouchers-salary"),
    partner: path(ROOTS.app, "/vouchers-partner"),
  },

     user: {
      root: path(ROOTS.app, '/user/*'),
      detail: path(ROOTS.app, '/user-detail/:id'),
   
    },
     productAll: {
      root: path(ROOTS.app, '/products-list'),
    },
    

    report: {
      supplier: path(ROOTS.app, '/report/supplier'),
      employee: path(ROOTS.app, '/report/employee'),
    },
  
    botNotification : {
      root:  path(ROOTS.app, '/bot-notification'),
      // update: path(ROOTS.app, '/bot-notification/:id'),
      create: path(ROOTS.app, '/bot-notification/create'),
    },


  orderSupplier: {
    root: path(ROOTS.app, "/order-supplier"),
    create: path(ROOTS.app, "/order-supplier/create"),
    update: path(ROOTS.app, "/order-supplier/:id"),
  },
  freelanceContractPharmacy: {
    root: path(ROOTS.app, "/freelance-contract-pharmacy"),
  },
  costManagement:{
    root: path(ROOTS.app, "/cost-management"),
    create: path(ROOTS.app, "/cost-management/create"),
    update: path(ROOTS.app, "/cost-management/:id"),
  },

  salesGroup : {
    root:  path(ROOTS.app, '/area-configuration'),
  },
  baseSalary : {
    root:  path(ROOTS.app, '/base-salary'),
  },
  benefitConfiguration : {
    root:  path(ROOTS.app, '/benefit-configuration'),
  },
  cronSalary : {
    root:  path(ROOTS.app, '/cronSalary'),
  },
  saleChannel: {
    root: path(ROOTS.app, '/sale-channel'),
    detail: path(ROOTS.app, '/sale-channel/:id'),
  },
  configurationCronTime: {
    root: path(ROOTS.app, "/configuration-cronTime"),
  },
  typePharmacy: {
    root: path(ROOTS.app, "/type-pharmacy"),
    detail: path(ROOTS.app, "/type-pharmacy/:id"),
  },
  groupPharmacy: {
    root: path(ROOTS.app, "/group-pharmacy"),
    detail: path(ROOTS.app, "/group-pharmacy/:id"),
  },
  myNotification: {
    root: path(ROOTS.app, '/my-notification')
  },

  collaborator: {
    root: path(ROOTS.app, "/collaborator/*"),
    detail: path(ROOTS.app, "/collaborator-detail/:id"),
  },
  reportProductSupplier: {
    root: path(ROOTS.app, "/report-product-supplier")
  },
  reportSalaryPartner:{
    root: path(ROOTS.app, "/reportSalaryPartner")
  },

  warehouse:{
    setting: path(ROOTS.app, "/warehouse-setting"),
    inventory: path(ROOTS.app, "/warehouse-inventory"),
  },

  reportIndividualCollaborator: {
    root: path(ROOTS.app, "/reportIndividualCollaborator"),
  },
  reportIndividualEmployeeSeller: {
    root: path (ROOTS.app, "/reportIndividualEmployeeSeller"),
  },
  reportOverview: {
    root: path(ROOTS.app, "/report-overview")
  },
  reportGroupCollaborator: {
    root: path(ROOTS.app, "/report-group-collaborator")
  },
  reportGroupEmployeeSeller: {
    root: path(ROOTS.app, "/report-group-employee-seller")
  },

  customerSegmentation: {
    root: path(ROOTS.app, "/customer-segmentation")
  },

  coupon : {
    root: path(ROOTS.app, "/coupon")
  },
};
