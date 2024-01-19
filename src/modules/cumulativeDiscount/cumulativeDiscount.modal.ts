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
    typeDiscount : string,
    value : number,
    valueType : string,
    typeReward : string,
    condition : conditionType | null,
    applyUnit : string | null,
    applyTimeSheet : applyTimeSheetType | null,
    cumulativeTimeSheet : applyTimeSheetType | null,
    status:"ACTIVE" | "INACTIVE"
  
  }
  export type TypePropsDiscountList = {
    loading? : any,
    form : any,
    target : string
  }