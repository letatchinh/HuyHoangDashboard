export type TypeProps = {
    
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
export type billItem = {
    cumulativeDiscount : typeCumulativeDiscount[],
    productId : string,
    variantId : string,
    totalPrice : number,
    quantity : number,
    supplierId : string,
    lotNumber : string,
    expirationDate : string,
}
export type FormFieldCreateBill = {
    pharmacyId : string,
    billItems : billItem[]
}
type supplier = {
    name : string,
    code : string,
    phoneNumber : string,
    _id : string,
}
type unit = {
    name : string,
    _id : string,
}
type variant = {
    exchangeValue : number,
    price : number,
    productUnit : string,
    unit : unit,
    variantIsDefault : boolean,
    _id : string,
}
export type ItemSearchProduct = {
    cumulativeDiscount : typeCumulativeDiscount[],
    medicalCode : string,
    name : string,
    supplier : supplier,
    supplierId : string,
    variant : variant
    _id : string
}