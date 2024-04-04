import { getOptions } from "~/utils/helpers"

export const method = {
    LK : "LK"
}
export const METHOD_TYPE = {
    BILL : "BILL",
     LK : "LK",
     BILLITEM : "BILLITEM",
     ORDER : "ORDER",
     ORDERITEM : "ORDERITEM"
}
export const METHOD_TYPE_VI = {
     BILL : "Đơn hàng",
     LK : "Luỹ kế",
     BILLITEM : "Sản phẩm trong đơn hàng nhà thuốc",
     ORDER : "Đơn hàng nhà cung cấp",
     ORDERITEM : "Sản phẩm trong đơn hàng nhà cung cấp"
}
export const METHOD_TYPE_OPTIONS = getOptions(METHOD_TYPE_VI).filter(({value} : any) => value === 'BILL');