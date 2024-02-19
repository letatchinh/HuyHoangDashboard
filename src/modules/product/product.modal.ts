import { cumulativeDiscountType } from "../cumulativeDiscount/cumulativeDiscount.modal"

export type TypePropsFormProduct = {
    supplierId?:string,
    id?:string,
    onCancel : () => void
}
export type TypePropsListProduct = {
    supplierId?:string,
}
export type variantType = {
    productUnit : string,
    productId : string,
    exchangeValue : number,
    price : number,
    cost : number,
    variantIsDefault : boolean,
}
export type conditionType = {
  gte : number,
  lte?:number,
  isRanger : boolean,
}
export type applyTimeSheetType = {
  gte : number,
  lte?:number,
  isRepeat : boolean,
}
// export type cumulativeDiscountType = {
//   target : string,
//   targetId : string,
//   name : string,
//   typeDiscount : string,
//   value : number,
//   valueType : string,
//   typeReward : string,
//   condition : conditionType | null,
//   applyVariantId : string | null,
//   applyTimeSheet : applyTimeSheetType | null,
//   status: "ACTIVE" | "INACTIVE"


// }
export type FieldTypeFormProduct = {
    name: string;
    type: string;
    saleLevel: string;
    supplierId: string;
    productDetail : {
        package : string,
        element : string,
        country : string,
    },
    manufacturerId : string,
    productGroupId : string,
    medicalCode : string,
    variants : variantType[],
    cumulativeDiscount : cumulativeDiscountType[]
    codeBySupplier : string
  };

  export type TypePropVariants = {
    form : any,
    isLoading : boolean,
    setDataNotificationUndo : (data? : any) => void
  }

  export type TypePropsDiscountList = {
    loading? : any,
    form : any,
    target : string
  }