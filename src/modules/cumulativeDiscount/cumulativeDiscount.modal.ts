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
  export type cumulativeDiscountType = {
    target : string,
    targetId : string,
    name : string,
    typeDiscount : "LK" | "DISCOUNT.CORE" | "DISCOUNT.SOFT" | "DISCOUNT.SOFT.CONDITION",
    value : number,
    valueType : string,
    typeReward : "VALUE" | "PRODUCT" | "BONUS",
    condition : conditionType | null,
    applyVariantId : string | null,
    applyTimeSheet : applyTimeSheetType | null
    status:"ACTIVE" | "INACTIVE",
    timesReward : number,
    itemReward? : {
      name : string,
      quantity : number,
    }
  }
  export type TypePropsDiscountList = {
    loading? : any,
    form : any,
    target : string
  }