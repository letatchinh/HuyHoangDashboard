export type initStateSlice<T=any> = {
    isLoading?: boolean;
    list?: T[];
    listSearch?: T[];
    getListFailed?: any;

    paging?: {
      current: number,
      pageSize:number,
      total: number,
    }|null;

    createSuccess?: any;
    createFailed?: any;
  
    updateSuccess?: any;
    updateFailed?: any;
  
    deleteSuccess?: any;
    deleteFailed?: any;
  
    submitSuccess?: any;
    submitFailed?: any;
  
    isSubmitLoading?: boolean;
  
    byId?: any;
    isGetByIdLoading?: boolean;
    getByIdFailed?: any;
  };

  const moduleRedux ={
    auth:'auth',
    supplier:'supplier',
    branch:'branch',
    geo:'geo',
    statusConfig:'statusConfig',
    configDiscount: 'configDiscount',
    employee:'employee',
    employeeGroup:'employeeGroup',
    user: 'user',
    userGroup: 'userGroup',
    policy: 'policy',
    productGroup:'productGroup',
    manufacturer:'manufacturer',
    productUnit:'productUnit',
    ranking:'ranking',
    medicine:'medicine',
    product:'product',
    workBoard:'workBoard',
    pharmacy: "pharmacy",
    // Đơn hàng
    bill: "bill",
    quotation: "quotation",
    botNotification: "botNotification",
    workSprint:'workSprint',
    workList:'workList',
    workTask:'workTask',
    vouchers: "vouchers",
    receiptVoucher: "receiptVoucher",
    paymentVoucher: "paymentVoucher",
    lk: "lk",
    productsAll: "productsAll",
    orderSupplier: "orderSupplier",
    freelanceContractPharmacy: "freelanceContractPharmacy",
    costManagement: "costManagement",
    salesGroup: "salesGroup",
    baseSalary: "baseSalary",
    benefitConfiguration: "benefitConfiguration",
    reportEmployee: "reportEmployee",
    cronSalary: "cronSalary",
    reportSupplier: "reportSupplier",
    saleChannel: "saleChannel",
    configurationCronTime : "configurationCronTime",
    typePharmacy: "typePharmacy",
    groupPharmacy: "groupPharmacy",
    notification: "notification",
    collaborator: "collaborator",
    collaboratorGroup: "collaboratorGroup",
    reportSalaryPartner: "reportSalaryPartner",

    }as const
    
    
  export type ModuleRedux = keyof typeof moduleRedux;

  export interface voidReducer {
    getListRequest : (state:any,payload?:any) => any;
    getListSuccess:(state:any,payload?:any)=>any;
    getListFailed:(state:any,payload?:any)=>any;
    getByIdRequest : (state:any,payload?:any) => any;
    getByIdSuccess:(state:any,payload?:any)=>any;
    getByIdFailed:(state:any,payload?:any)=>any;
    createRequest:(state:any,payload?:any)=>any;
    createSuccess:(state:any,payload?:any)=>any;
    createFailed:(state:any,payload?:any)=>any;
    updateRequest:(state:any,payload?:any)=>any;
    updateSuccess:(state:any,payload?:any)=>any;
    updateFailed:(state:any,payload?:any)=>any;
    deleteRequest:(state:any,payload?:any)=>any;
    deleteSuccess:(state:any,payload?:any)=>any;
    deleteFailed:(state:any,payload?:any)=>any;
    getRequest:(state:any,payload?:any)=>any;
    getSuccess:(state:any,payload?:any)=>any;
    getFailed:(state:any,payload?:any)=>any;
    onSearch:(state:any,payload?:any)=>any;
    resetAction:(state:any,payload?:any)=>any;
    reset: () => any;
  }
