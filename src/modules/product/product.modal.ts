export type TypePropsFormProduct = {
    supplierId?:string,
    id?:string,
    onCancel : () => void
}
export type TypePropsListProduct = {
    supplierId?:string,
}
type variantType = {
    productUnit : string,
    productId : string,
    exchangeValue : number,
    price : number,
    variantIsDefault : boolean,
}
export type FieldTypeFormProduct = {
    name: string;
    type: string;
    supplierId: string;
    productDetail : {
        package : string,
        element : string,
        country : string,
    },
    manufacturerId : string,
    productGroupId : string,
    medicalCode : string,
    variants : variantType[]
  };

  export type TypePropVariants = {
    form : any,
    isLoading : boolean
  }