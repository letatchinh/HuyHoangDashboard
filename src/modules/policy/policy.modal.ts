export type TypeProps = {
    
};
export type ResourceType = {
  GROUP_USER: string[],
  GROUP_EMPLOYEE: string[],
  GROUP_WHSETTING:  string[]
  GROUP_MANUFACTURER: string[],
  UNIT: string[],
  GROUP_PRODUCTGROUP: string[],
  GROUP_RANKING: string[],
  MEDICINE: string[]
  GROUP_PHARMA: string[],
  // Đơn hàng
  GROUP_BILL: string[],
  NOTIFICATION_BOT_MANAGER: string[],

  GROUP_SUPPLIER: string[],

  GROUP_WORK_MANAGERMENT: string[],
  GROUP_VOUCHER: string[],
  GROUP_MEDICINE: string[],
  GROUP_SHIPPINGCOST: string[],
  GROUP_REPORT: string[],
};

export type policyType = 'write' | 'read' | 'update' | 'delete' | 'download' | 'admin';

export type PoliciesType = {
  [key in
  //BRANCH
  "READ_BRANCH" |
  "WRITE_BRANCH" |
  "UPDATE_BRANCH" |
  "DELETE_BRANCH" |
  "DOWNLOAD_BRANCH" |
  "ADMIN_BRANCH" |
  "BRANCH" |
  //EMPLOYEE
  "READ_EMPLOYEE" |
  "WRITE_EMPLOYEE" |
  "UPDATE_EMPLOYEE" |
  "DELETE_EMPLOYEE" |
  "DOWNLOAD_EMPLOYEE" |
  "ADMIN_EMPLOYEE" |
  "EMPLOYEE" |
  //EMPLOYEE_GROUP
  "READ_EMPLOYEEGROUP" |
  "WRITE_EMPLOYEEGROUP" |
  "UPDATE_EMPLOYEEGROUP" |
  "DELETE_EMPLOYEEGROUP" |
  "DOWNLOAD_EMPLOYEEGROUP" |
  "ADMIN_EMPLOYEEGROUP" |
  "EMPLOYEEGROUP" |
  //USER
  "READ_USER" |
  "WRITE_USER" |
  "UPDATE_USER" |
  "DELETE_USER" |
  "DOWNLOAD_USER" |
  "ADMIN_USER" |
  "USER" |
  //USERGROUP
  "READ_USERGROUP" |
  "WRITE_USERGROUP" |
  "UPDATE_USERGROUP" |
  "DELETE_USERGROUP" |
  "DOWNLOAD_USERGROUP" |
  "ADMIN_USERGROUP" |
  "USERGROUP" |
  //MANUFACTURER
  "READ_MANUFACTURER" |
  "WRITE_MANUFACTURER" |
  "UPDATE_MANUFACTURER" |
  "DELETE_MANUFACTURER" |
  "DOWNLOAD_MANUFACTURER" |
  "ADMIN_MANUFACTURER" |
  "MANUFACTURER"|
  //UNIT
  "READ_UNIT" |
  "WRITE_UNIT" |
  "UPDATE_UNIT" |
  "DELETE_UNIT" |
  "DOWNLOAD_UNIT" |
  "ADMIN_UNIT" |
  "UNIT"|
  //PRODUCTGROUP
  "READ_PRODUCTGROUP" |
  "WRITE_PRODUCTGROUP" |
  "UPDATE_PRODUCTGROUP" |
  "DELETE_PRODUCTGROUP" |
  "DOWNLOAD_PRODUCTGROUP" |
  "ADMIN_PRODUCTGROUP" |
  "PRODUCTGROUP"|
  //RANKING
  "READ_RANKING" |
  "WRITE_RANKING" |
  "UPDATE_RANKING" |
  "DELETE_RANKING" |
  "DOWNLOAD_RANKING" |
  "ADMIN_RANKING" |
  "RANKING"|
  //MEDICINE
  "READ_MEDICINE" |
  "WRITE_MEDICINE" |
  "UPDATE_MEDICINE" |
  "DELETE_MEDICINE" |
  "DOWNLOAD_MEDICINE" |
  "ADMIN_MEDICINE" |
  "MEDICINE"|
  //CONFIGDISCOUNT
  "READ_CONFIGDISCOUNT" |
  "WRITE_CONFIGDISCOUNT" |
  "UPDATE_CONFIGDISCOUNT" |
  "DELETE_CONFIGDISCOUNT" |
  "DOWNLOAD_CONFIGDISCOUNT" |
  "ADMIN_CONFIGDISCOUNT" |
  "CONFIGDISCOUNT" |
  // PHARMACY PROFILE
  "READ_PHARMAPROFILE" |
  "WRITE_PHARMAPROFILE" |
  "UPDATE_PHARMAPROFILE" |
  "DELETE_PHARMAPROFILE" |
  "DOWNLOAD_PHARMAPROFILE" |
  "ADMIN_PHARMAPROFILE" |
  "PHARMAPROFILE" |

  //Đơn hàng
  "READ_BILL" |
  "WRITE_BILL" |
  "UPDATE_BILL" |
  "DELETE_BILL" |
  "DOWNLOAD_BILL" |
  "ADMIN_BILL" |
  "BILL" |

  //Đơn hàng tạm
  "READ_QUOTATION" |
  "WRITE_QUOTATION" |
  "UPDATE_QUOTATION" |
  "DELETE_QUOTATION" |
  "DOWNLOAD_QUOTATION" |
  "ADMIN_QUOTATION" |
  "QUOTATION" |

  //NOTIFICATION BOT MANAGER
  "READ_NOTIFICATIONBOTMANAGER" |
  "WRITE_NOTIFICATIONBOTMANAGER" |
  "UPDATE_NOTIFICATIONBOTMANAGER" |
  "DELETE_NOTIFICATIONBOTMANAGER" |
  "DOWNLOAD_NOTIFICATIONBOTMANAGER" |
  "ADMIN_NOTIFICATIONBOTMANAGER" |
  "NOTIFICATIONBOTMANAGER" |

  //SUPPLIER
  "READ_SUPPLIER" |
  "WRITE_SUPPLIER" |
  "UPDATE_SUPPLIER" |
  "DELETE_SUPPLIER" |
  "DOWNLOAD_SUPPLIER" |
  "ADMIN_SUPPLIER" |
  "SUPPLIER" |
  
  //REVENUE SUPPLIER
  "READ_REVENUESUPPLIER" |
  "WRITE_REVENUESUPPLIER" |
  "UPDATE_REVENUESUPPLIER" |
  "DELETE_REVENUESUPPLIER" |
  "DOWNLOAD_REVENUESUPPLIER" |
  "ADMIN_REVENUESUPPLIER" |
  "REVENUESUPPLIER" | //
  
  //HISTORY SUPPLIER MINERRAL
  "READ_HISTORYSUPPLIERMINERRAL" |
  "WRITE_HISTORYSUPPLIERMINERRAL" |
  "UPDATE_HISTORYSUPPLIERMINERRAL" |
  "DELETE_HISTORYSUPPLIERMINERRAL" |
  "DOWNLOAD_HISTORYSUPPLIERMINERRAL" |
  "ADMIN_HISTORYSUPPLIERMINERRAL" |
  "HISTORYSUPPLIERMINERRAL"| //

  //PRODUCT
  "READ_PRODUCT" |
  "WRITE_PRODUCT" |
  "UPDATE_PRODUCT" |
  "DELETE_PRODUCT" |
  "DOWNLOAD_PRODUCT" |
  "ADMIN_PRODUCT" |
  "PRODUCT"|
  
  //WORK_MANAGEMENT
  'READ_WORKMANAGEMENT' |
  'WRITE_WORKMANAGEMENT' |
  'UPDATE_WORKMANAGEMENT' |
  'DELETE_WORKMANAGEMENT' |
  'DOWNLOAD_WORKMANAGEMENT' |
  'ADMIN_WORKMANAGEMENT' |

  //VOUCHER_PHARMACY
  "READ_VOUCHERPHARMACY" |
  "WRITE_VOUCHERPHARMACY" |
  "UPDATE_VOUCHERPHARMACY" |
  "DELETE_VOUCHERPHARMACY" |
  "DOWNLOAD_VOUCHERPHARMACY" |
  "ADMIN_VOUCHERPHARMACY" |
  "VOUCHERPHARMACY" |

  ''|


  //VOUCHER_SUPPLIER
  "READ_VOUCHERSUPPLIER" |
  "WRITE_VOUCHERSUPPLIER" |
  "UPDATE_VOUCHERSUPPLIER" |
  "DELETE_VOUCHERSUPPLIER" |
  "DOWNLOAD_VOUCHERSUPPLIER" |
  "ADMIN_VOUCHERSUPPLIER" |
  "VOUCHERSUPPLIER" |

  ''|
  
  //STATUS_VOUCHER
  "READ_STATUSVOUCHER" |
  "WRITE_STATUSVOUCHER" |
  "UPDATE_STATUSVOUCHER" |
  "DELETE_STATUSVOUCHER" |
  "DOWNLOAD_STATUSVOUCHER" |
  "ADMIN_STATUSVOUCHER" |
  "STATUSVOUCHER" |

  //HISTORY_VOUCHER
  "READ_HISTORYVOUCHER" |
  "WRITE_HISTORYVOUCHER" |
  "UPDATE_HISTORYVOUCHER" |
  "DELETE_HISTORYVOUCHER" |
  "DOWNLOAD_HISTORYVOUCHER" |
  "ADMIN_HISTORYVOUCHER" |
  "HISTORYVOUCHER" |
  
  //DEBTSUPPILER
  "READ_DEBTSUPPILER" |
  "WRITE_DEBTSUPPILER" |
  "UPDATE_DEBTSUPPILER" |
  "DELETE_DEBTSUPPILER" |
  "DOWNLOAD_DEBTSUPPILER" |
  "ADMIN_DEBTSUPPILER" |
  "DEBTSUPPILER"|

  
  "USERGROUP"|
  //CONFIGDISCOUNT
  "READ_CONFIGDISCOUNT" |
  "WRITE_CONFIGDISCOUNT" |
  "UPDATE_CONFIGDISCOUNT" |
  "DELETE_CONFIGDISCOUNT" |
  "DOWNLOAD_CONFIGDISCOUNT" |
  "ADMIN_CONFIGDISCOUNT" |
  "CONFIGDISCOUNT" |
  //GROUP_TODOSTATUSCONFIG

  'READ_TODOLIST' |
  'WRITE_TODOLIST' |
  'UPDATE_TODOLIST' |
  'DELETE_TODOLIST' |
  'DOWNLOAD_TODOLIST' |
  'ADMIN_TODOLIST' |
  //GROUP_TODOCONFIGSTATUS
  'READ_TODOCONFIGSTATUS'|
  'WRITE_TODOCONFIGSTATUS' |
  'UPDATE_TODOCONFIGSTATUS' |
  'DELETE_TODOCONFIGSTATUS' |
  'DOWNLOAD_TODOCONFIGSTATUS' |
  'ADMIN_TODOCONFIGSTATUS' |
  ''|
  'READ_MEDICINE'|
  'WRITE_MEDICINE' |
  'UPDATE_MEDICINE' |
  'DELETE_MEDICINE' |
  'DOWNLOAD_MEDICINE' |
  'ADMIN_MEDICINE' |
  ''|
  'READ_SHIPPINGCOST'|
  'WRITE_SHIPPINGCOST' |
  'UPDATE_SHIPPINGCOST' |
  'DELETE_SHIPPINGCOST' |
  'DOWNLOAD_SHIPPINGCOST' |
  'ADMIN_SHIPPINGCOST' |

  ''|
  'READ_AREACONFIGURATION'|
  'WRITE_AREACONFIGURATION' |
  'UPDATE_AREACONFIGURATION' |
  'DELETE_AREACONFIGURATION' |
  'DOWNLOAD_AREACONFIGURATION' |
  'ADMIN_AREACONFIGURATION' |

  //REPORT 
  'READ_REPORTSALARY'|
  'WRITE_REPORTSALARY' |
  'UPDATE_REPORTSALARY' |
  'DELETE_REPORTSALARY' |
  'DOWNLOAD_REPORTSALARY' |
  'ADMIN_REPORTSALARY' |

  'READ_CONFIGBASESALARY'|
  'WRITE_CONFIGBASESALARY' |
  'UPDATE_CONFIGBASESALARY' |
  'DELETE_CONFIGBASESALARY' |
  'DOWNLOAD_CONFIGBASESALARY' |
  'ADMIN_CONFIGBASESALARY' | 

  'READ_CONFIGCRONTIME'|
  'WRITE_CONFIGCRONTIME' |
  'UPDATE_CONFIGCRONTIME' |
  'DELETE_CONFIGCRONTIME' |
  'DOWNLOAD_CONFIGCRONTIME' |
  'ADMIN_CONFIGCRONTIME' |

  //
  'READ_CONFIGBENEFIT'|
  'WRITE_CONFIGBENEFIT' |
  'UPDATE_CONFIGBENEFIT' |
  'DELETE_CONFIGBENEFIT' |
  'DOWNLOAD_CONFIGBENEFIT' |
  'ADMIN_CONFIGBENEFIT' |
  
  //
  'READ_CUMULATIVESALESUPPLIER'|
  'WRITE_CUMULATIVESALESUPPLIER' |
  'UPDATE_CUMULATIVESALESUPPLIER' |
  'DELETE_CUMULATIVESALESUPPLIER' |
  'DOWNLOAD_CUMULATIVESALESUPPLIER' |
  'ADMIN_CUMULATIVESALESUPPLIER'|
  //
  'READ_CONTRACTPHARMACY'|
  'WRITE_CONTRACTPHARMACY' |
  'UPDATE_CONTRACTPHARMACY' |
  'DELETE_CONTRACTPHARMACY' |
  'DOWNLOAD_CONTRACTPHARMACY' |
  'ADMIN_CONTRACTPHARMACY' |
  //
  'READ_EMPLOYEEPOSITION'|
  'WRITE_EMPLOYEEPOSITION' |
  'UPDATE_EMPLOYEEPOSITION' |
  'DELETE_EMPLOYEEPOSITION' |
  'DOWNLOAD_EMPLOYEEPOSITION' |
  'ADMIN_EMPLOYEEPOSITION' |
  //
  'READ_SALESGROUP'|
  'WRITE_SALESGROUP' |
  'UPDATE_SALESGROUP' |
  'DELETE_SALESGROUP' |
  'DOWNLOAD_SALESGROUP' |
  'ADMIN_SALESGROUP' |

  //
  
  //GROUP_TODOSTATUSCONFIG
  
  'READ_CUMULATIVEEVENT' |
  'WRITE_CUMULATIVEEVENT' |
  'UPDATE_CUMULATIVEEVENT' |
  'DELETE_CUMULATIVEEVENT' |
  'DOWNLOAD_CUMULATIVEEVENT' |
  'ADMIN_CUMULATIVEEVENT' |

  'READ_ORDERSUPPLIER'|
  'WRITE_ORDERSUPPLIER' |
  'UPDATE_ORDERSUPPLIER' |
  'DELETE_ORDERSUPPLIER' |
  'DOWNLOAD_ORDERSUPPLIER' |
  'ADMIN_ORDERSUPPLIER' 
  ]: [string, policyType];
};
