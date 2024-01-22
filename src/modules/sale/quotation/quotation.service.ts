import { pick } from "lodash";
import { quotation, FormFieldCreateBill, PayloadCreateBill } from "../bill/bill.modal";

type paramsConvertDataQuotation = {
    data : FormFieldCreateBill,
    quotationItems : quotation[],
    totalPriceAfterDiscount : number,
    _id? : string
}
export const convertDataQuotation = ({data,quotationItems,totalPriceAfterDiscount,_id}:paramsConvertDataQuotation) => {
    const quotationItemsSubmit : Omit<quotation,'variant' | 'variants'>[] = quotationItems?.map((quotation : quotation) => ({
        ...pick(quotation,[
          'cumulativeDiscount',
          'productId',
          'variantId',
          'price',
          'totalPrice',
          'quantity',
          'supplierId',
          'lotNumber',
          'expirationDate',
          'codeBySupplier'
        ])
      }));
      // FixME : Verify Component not Updated data
      // verifyData(() => {
      //   const submitData : PayloadCreateBill = {
      //     ...values,
      //     quotationItems : quotationItemsSubmit,
      //     pair : 0,
      //     totalPrice : totalPriceAfterDiscount
      //   };
    
      //   console.log(submitData,'submitData');
      // });
      const submitData : PayloadCreateBill = {
          ...data,
          quotationItems : quotationItemsSubmit,
          pair : 0,
          totalPrice : totalPriceAfterDiscount,
          ..._id && {_id}
        };
        return submitData;
}