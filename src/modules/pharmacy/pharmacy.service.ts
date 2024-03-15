import { get } from 'lodash';
import subvn from '~/core/subvn';
import CumulativeDiscountModule from '~/modules/cumulativeDiscount';
import { getAreaByCode } from '~/utils/helpers';
  export const convertInitPharmacy = (pharmacy : any) => {
    // Convert CumulativeDiscount
    // const cumulativeDiscount = CumulativeDiscountModule.service.convertInitDiscount(get(pharmacy,'cumulativeDiscount',[]));
    return {
      ...pharmacy,
      // cumulativeDiscount
    }
    };

export const convertSubmitData = (values : any) => {
  const cityInfo = subvn.getCityByCode(get(values,'address.cityId'));
    const submitData = {
      ...values,
      address : {
        ...get(values,'address'),
        areaId : get(cityInfo,'area_code')
      }
      // cumulativeDiscount : CumulativeDiscountModule.service.convertSubmitDiscount(get(values,'cumulativeDiscount')),
    };

    return submitData;
}