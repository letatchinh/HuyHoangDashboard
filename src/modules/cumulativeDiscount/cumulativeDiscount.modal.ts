export type conditionType = {
    gte : number,
    lte?:number,
    isRanger : boolean,
}

  export type itemSession = {
    d_start : number,
    d_end : number,
    session_id : string
}

export type TypeRepeatType = "ranger" | "month" | "quarter" | "nope";

  export type applyTimeSheetType = {
  //   repeat:{
  //     "1":itemSession[],
  //     "2":itemSession[],
  //     "3":itemSession[],
  //     "4":itemSession[],
  //     "5":itemSession[],
  //     "6":itemSession[],
  //     "7":itemSession[],
  //     "8":itemSession[],
  //     "9":itemSession[],
  //     "10":itemSession[],
  //     "11":itemSession[],
  //     "12":itemSession[],
  // },
  repeat : any,
  nonRepeat :{
      gte:Date,
      lte:Date,
      session_id : string,
  },
  typeRepeat : TypeRepeatType
  }
  export type cumulativeTimeSheet = {
  //   repeat:{
  //     "1":itemSession[],
  //     "2":itemSession[],
  //     "3":itemSession[],
  //     "4":itemSession[],
  //     "5":itemSession[],
  //     "6":itemSession[],
  //     "7":itemSession[],
  //     "8":itemSession[],
  //     "9":itemSession[],
  //     "10":itemSession[],
  //     "11":itemSession[],
  //     "12":itemSession[],
  // },
  repeat : any,
  nonRepeat :{
      gte:Date,
      lte:Date,
      session_id : string,
  },
  typeRepeat : TypeRepeatType
  }
  export type cumulativeDiscountType = {
    target : string,
    targetId : string,
    name : string,
    typeDiscount : "LK" | "DISCOUNT.CORE" | "DISCOUNT.SOFT" | "DISCOUNT.SOFT.CONDITION",
    value : number,
    valueType : "VALUE" | "PERCENT",
    typeReward : "VALUE" | "PRODUCT" | "BONUS",
    condition : conditionType | null,
    applyVariantId : string | null,
    applyTimeSheet : applyTimeSheetType | null,
    cumulativeTimeSheet : cumulativeTimeSheet | null,
    status:"ACTIVE" | "INACTIVE",
    _id : string | null
  
    timesReward : number,
    itemReward? : {
      name : string,
      quantity : number,
    }
  }
  export type TypePropsDiscountList = {
    loading? : any,
    form : any,
    target : string,
    targetType: string,
    supplierId? : string
  }