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

}