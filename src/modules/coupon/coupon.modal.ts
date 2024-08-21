import { DetailCoupon, quotation } from "../sale/bill/bill.modal"

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
    giftCode: string,
    name: string,
    description?: string,
    startDate?: Date,
    endDate?: Date,
    branchId: number,
    state: 'PUBLIC' | 'PRIVATE',
    limit?: number,
    applyFor?: 'SHIP' | 'BILL',
    discount: {
        type: 'PERCENT' | 'VALUE',
        value: number,
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
    isFreeShip?:boolean,
    allowAllApply?:{
      b2b : boolean,
      b2c : boolean,
      all : boolean,
    },


};
export interface CouponInSelect extends CouponBase {
  conditionsTrue?: detailCondition[],
  couponAtVariantId? : string
}
export type QuerySearchCoupon = {
  target: 'BILL' | 'BILL_ITEM',
  variantId?: string,
  customerApplyId?: {
      id?: string,
      refCollection: 'pharma_profile' | 'partner'
  },
  billPrice?: number,
  billGroupPrice?: number,
  productCount?: number,
  productGroupCount?: number,
}

interface BillItemVerify {
  productId: string;
  quantity: number;
  totalRoot?: number;
  productGroupId?: string;
}
export interface VerifyCoupon {
  customerApplyId?: {
    id?: string,
    refCollection: 'pharma_profile' | 'partner'
},
billPrice?: number,
productCount?: number,
coupons?: DetailCoupon,
isValidateCount?: boolean,
billItem : BillItemVerify[],
}