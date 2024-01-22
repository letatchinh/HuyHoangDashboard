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
export type variant = {
    exchangeValue : number,
    price : number,
    productUnit : string,
    unit : unit,
    variantIsDefault : boolean,
    _id : string,
}
export type typeCumulativeDiscount = {
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
export type quotation = {
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
}
export type FormFieldCreateBill = {
    pharmacyId : string,
    debtType : string,
}
export type PayloadCreateBill = {
    pharmacyId : string,
    quotationItems : Omit<quotation,'variant' | 'variants'>[],
    totalPrice : number,
    pair : number,
    _id? : any,
}
export type PayloadUpdateBill = {
    note : string,
    status : "CANCELLED",
}

export type ItemSearchProduct = {
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

export type DebtType = {
    alias : string,
    key : string,
    name : string,
    id : number,

}