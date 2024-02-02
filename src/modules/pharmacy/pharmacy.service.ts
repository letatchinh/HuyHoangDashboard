import { get } from 'lodash';
import CumulativeDiscountModule from '~/modules/cumulativeDiscount';
  export const convertInitPharmacy = (pharmacy : any) => {
    // Convert CumulativeDiscount
    // const cumulativeDiscount = CumulativeDiscountModule.service.convertInitDiscount(get(pharmacy,'cumulativeDiscount',[]));
    return {
      ...pharmacy,
      // cumulativeDiscount
    }
    };

export const convertSubmitData = (values : any) => {
    const submitData = {
      ...values,
      // cumulativeDiscount : CumulativeDiscountModule.service.convertSubmitDiscount(get(values,'cumulativeDiscount')),
    };

    return submitData;
}