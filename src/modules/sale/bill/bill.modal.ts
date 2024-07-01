import { ValueApplyBill } from "~/modules/logistic/components/LogisticForm"
import { STATUS_BILL } from "./constants"

type supplier = {
    name : string,
    code : string,
    phoneNumber : string,
    _id : string,
    address : any,
    id : string,
}
type unit = {
    name : string,
    _id : string,
}

type productDetailType = {
    country : number,
    element : string,
    package : string,
}
type productGroup = {
    code : string,
    name : string,
    _id : string,
}
type manufacturerType = {
    description : string,
    id : string,
    _id : string,
    name : string
}
export interface variant  {
    exchangeValue : number,
    price : number,
    productUnit : string,
    unit : unit,
    variantIsDefault : boolean,
    _id : string,
}
export interface typeCumulativeDiscount  {
    typeReward : string,
    value : string,
    name : string,
    valueType : string,
    target : string,
    targetId : string,
    typeDiscount : string,
    session : string,
    code : string,
}
export interface quotation  {
    cumulativeDiscount : typeCumulativeDiscount[],
    productId : string,
    variantId : string,
    variant : variant,
    variants : variant[],
    price : number,
    totalPrice : number,
    quantity : number,
    supplierId : string,
    lotNumber : string,
    expirationDate : string,
    codeBySupplier : string,
    discountOther : DiscountOtherType[]
}
export interface FeeType  {
    typeFee : 'SUB_FEE' | 'LOGISTIC',
    typeValue : 'PERCENT' | 'VALUE',
    value : number
}
export interface FormFieldCreateBill {
    pharmacyId : string | null,
    debtType : string | null,
    pair : number,
    fee? : FeeType[],
    deliveryAddress?: string,
    dataTransportUnit?: ValueApplyBill,
    deliveryAddressId?: any;
    warehouseId?: string;
    warehouseName?: string;
}
export interface PayloadCreateBill extends FormFieldCreateBill {
    quotationItems : Omit<quotation,'variant' | 'variants'>[],
    totalPrice : number,
    totalAmount : number,
    _id?: any,
    dataTransportUnit?: ValueApplyBill
}
export interface PayloadUpdateBill  {
    cancelNote? : string,
    note? : string,
    status? : "CANCELLED" | 'REQUESTED',
    _id : string
}
export interface DiscountOtherType {
    typeDiscount : 'PERCENT' | 'VALUE',
    value : number,
    name : string
}
export interface ItemSearchProduct  {
    cumulativeDiscount : typeCumulativeDiscount[],
    medicalCode : string,
    name : string,
    supplier : supplier,
    supplierId : string,
    variants : variant[],
    selectVariant : string,
    _id : string,
    productDetail : productDetailType,
    productGroup : productGroup,
    productGroupId : string,
    manufacturerId : string,
    manufacturer : manufacturerType
}

export interface DebtType  {
    alias : string,
    key : string,
    name : string,
    id : number,

}
export type ParamGetNextStatus = {
    status: string;
    lotNumber?: any;
    expirationDate: any;
  }

export type FormFieldSearch = {
    startDate?: any,
    endDate?: any,
    // sortBy :{COMPLETED, NEW}
    // searchBy?: SearchByType,
  };

export type propsConfirmStatusBill = {
    status: keyof typeof STATUS_BILL;
    id?: string | null;
    bill?: any;
    note?: string;
    statusCurrent?: string | null | undefined;
};