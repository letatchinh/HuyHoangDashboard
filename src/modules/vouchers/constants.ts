import { getOptions } from "~/utils/helpers"

export const method = {
    LK : "LK"
}
export const METHOD_TYPE = {
    BILL : "BILL",
     LK : "LK",
     BILLITEM : "BILLITEM",
     ORDER : "ORDER",
     ORDERITEM : "ORDERITEM",
     VOUCHER_SALARY : "VOUCHER_SALARY",
     SALARY_EMPLOYEE : "SALARY_EMPLOYEE",
}
export const METHOD_TYPE_VI = {
     BILL : "Đơn hàng",
     LK : "Luỹ kế",
     BILLITEM : "Sản phẩm trong đơn hàng khách hàng B2B",
     ORDER : "Đơn hàng nhà cung cấp",
     ORDERITEM : "Sản phẩm trong đơn hàng nhà cung cấp",
     SALARY_EMPLOYEE : 'Lương trình dược viên',
     VOUCHER_SALARY: "Lương CTV/ TDV"
}
export const METHOD_TYPE_OPTIONS = getOptions(METHOD_TYPE_VI).filter(({value} : any) => ['BILL','VOUCHER_SALARY','SALARY_EMPLOYEE'].includes(value));
