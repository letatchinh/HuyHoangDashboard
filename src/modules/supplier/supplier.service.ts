import { get } from 'lodash';
import ProductModule from '~/modules/product'
import { FieldType } from './supplier.modal';
export const convertSubmitData = (values : FieldType) => {
    const submitData = {
      ...values,
      cumulativeDiscount : ProductModule.service.convertSubmitDiscount(get(values,'cumulativeDiscount')),
    };

    return submitData;
}