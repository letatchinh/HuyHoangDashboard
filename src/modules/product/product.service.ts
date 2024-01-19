import { get } from "lodash";
import CumulativeDiscountModule from '~/modules/cumulativeDiscount';
import { FieldTypeFormProduct } from "./product.modal";
type paramsConvert = {
    values: FieldTypeFormProduct,
    supplierId : string | undefined
};

export const convertSubmitData = ({values,supplierId} :paramsConvert) => {
      const submitData = {
        ...values,
        cumulativeDiscount : CumulativeDiscountModule.service.convertSubmitDiscount(get(values,'cumulativeDiscount')),
        supplierId,
      };

      return submitData;
}


export const convertInitProduct = (product : any) => {
  // Convert CumulativeDiscount
  const cumulativeDiscount = CumulativeDiscountModule.service.convertInitDiscount(get(product,'cumulativeDiscount',[]));
  return {
    ...product,
    cumulativeDiscount
  }
  };

