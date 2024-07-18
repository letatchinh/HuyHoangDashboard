import { get, pick } from "lodash";
import { DetailCoupon, FormFieldCreateBill, PayloadCreateBill, quotation } from "../bill/bill.modal";
import { DEFAULT_DEBT_TYPE } from "./constants";

type paramsConvertDataQuotation = {
    data : FormFieldCreateBill,
    quotationItems : quotation[],
    totalPriceAfterDiscount : number,
    totalAmount : number,
    _id?: string,
    dataTransportUnit?: any,
    warehouseId?: string | undefined,
    noteBillSplit?: string,
    coupons? : DetailCoupon,
    totalCouponForShip? : number,
    totalCouponForBill? : number,
    totalCouponForItem? : number,
  }
  export const convertDataQuotation = ({data,quotationItems,totalPriceAfterDiscount,_id,totalAmount,dataTransportUnit,warehouseId,noteBillSplit,totalCouponForBill,totalCouponForShip,totalCouponForItem,coupons}:paramsConvertDataQuotation) : PayloadCreateBill => {
      const quotationItemsSubmit : Omit<quotation,'variant' | 'variants'>[] = quotationItems?.map((quotation : quotation) => ({
          ...pick(quotation,[
            'cumulativeDiscount',
            'productId',
            'variantId',
            'price',
            'totalPrice',
            'supplierId',
            'lotNumber',
            'expirationDate',
            'codeBySupplier',
            'quantity',
            'discountOther',
            'couponsInItem',
            'totalDiscountCoupon',
            'totalDiscountSummary',
            'totalRoot',
          ]),
        }));
        // Todo : Verify Data When Send to sever (Not implemented)
        
        const submitData: PayloadCreateBill = {
          ...data,
          quotationItems: quotationItemsSubmit,
          pair: data?.pair || 0,
          debtType: data?.debtType || DEFAULT_DEBT_TYPE,
          totalPrice: totalPriceAfterDiscount,
          totalAmount,
          ...(_id && { _id }),
          dataTransportUnit,
          warehouseId,
          noteBillSplit,
          totalCouponForBill,
          totalCouponForShip,
          totalCouponForItem,
          coupons,
        };
        return submitData;
}