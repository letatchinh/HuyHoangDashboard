export type detailCondition = {
    key: 'BILL_FIRST' | 'BILL_PRICE' | 'PRODUCT_COUNT',
    value: {
      BILL_FIRST : {

      },
      BILL_PRICE : {
        value : Number,
      },
      PRODUCT_COUNT : {
        value : Number,
      },
      
    },
    isActive: boolean,
}

export type detailCustomerApplyFor = {
    id:string,
    refCollection: 'pharma_profile' | 'partner'
}

export type detailTargetIds = {
    id:string,
    refCollection: 'product' | 'product_group'
}
export interface CouponBase {
    _id ? : string,
    code: number,
    name: string,
    description?: string,
    startDate?: Date,
    endDate?: Date,
    branchId: number,
    state: 'PUBLIC' | 'PRIVATE',
    limit?: number,
    applyFor?: 'SHIP' | 'BILL',
    discount?: {
        type?: 'PERCENT' | 'VALUE',
        value?: number,
        maxDiscount? : number
    },
    conditions?: detailCondition[],
    status?: 'ACTIVE' | 'INACTIVE',
    deletedAt?: Date,
    history?: Object,
    customerApplyIds: detailCustomerApplyFor[],
    target?: 'BILL' | 'BILL_ITEM',
    targetIds?: detailTargetIds[],
    multiple?: boolean,
    slugName?: string,
    disabledCondition? : boolean,


};
export interface CouponInSelect extends CouponBase {
  conditionsTrue?: detailCondition[],
}
export type QuerySearchCoupon = {
  target: 'BILL' | 'BILL_ITEM',
  targetId?: {
      id?: string,
      refCollection: 'product' | 'product_group'
    },
    customerApplyId?: {
      id?: string,
      refCollection: 'pharma_profile' | 'partner'
  },
  billPrice?: number,
  productCount?: number,
}