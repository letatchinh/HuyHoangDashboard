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
    VOUCHER_SALARY: "VOUCHER_SALARY"
} as const
export const METHOD_TYPE_VI = {
     BILL : "Đơn hàng",
     LK : "Luỹ kế",
     BILLITEM : "Sản phẩm trong đơn hàng nhà thuốc",
     ORDER : "Đơn hàng nhà cung cấp",
     ORDERITEM : "Sản phẩm trong đơn hàng nhà cung cấp",
     VOUCHER_SALARY: "Lương CTV/ TDV"
}
export const METHOD_TYPE_OPTIONS = getOptions(METHOD_TYPE_VI).filter(({value} : any) => ['BILL', 'VOUCHER_SALARY'].includes(value));