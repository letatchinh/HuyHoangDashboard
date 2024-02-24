
export interface FormFieldCreateOrderSupplier{
    supplierId : string | null,
    debtType : string | null,
    pair : number
}

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
export interface orderSupplier  {
    cumulativeDiscount : typeCumulativeDiscount[],
    productId : string,
    variantId : string,
    variant : variant,
    variants : variant[],
    unitPrice : number,
    totalPrice : number,
    quantity : number,
    supplierId : string,
    lotNumber : string,
    expirationDate : string,
    codeBySupplier : string,
}
export interface FormFieldCreateOrderSupplier {
    supplierId : string | null,
    debtType : string | null,
    pair : number
}
export interface PayloadCreateOrderSupplier extends FormFieldCreateOrderSupplier {
    orderSupplierItems : Omit<orderSupplier,'variant' | 'variants'>[],
    totalPrice : number,
    totalAmount : number,
}
export interface PayloadUpdateOrderSupplier  {
    cancelNote? : string,
    note? : string,
    status? : "CANCELLED",
    _id : string
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