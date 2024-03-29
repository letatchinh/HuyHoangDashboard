import { get } from 'lodash';
import CumulativeDiscountModule from '~/modules/cumulativeDiscount'
import { FieldType } from './supplier.modal';
export const convertInitSupplier = (supplier : any) => {
  // Convert CumulativeDiscount
  const cumulativeDiscount = CumulativeDiscountModule.service.convertInitDiscount(get(supplier,'cumulativeDiscount',[]));
  return {
    ...supplier,
    cumulativeDiscount,
  }
  };

export const convertSubmitData = (values : FieldType) => {
    const submitData = {
      ...values,
      cumulativeDiscount: CumulativeDiscountModule.service.convertSubmitDiscount(get(values, 'cumulativeDiscount')),
    };

    return submitData;
}