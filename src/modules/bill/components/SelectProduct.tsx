import { get } from 'lodash';
import React, { useCallback } from 'react';
import DebounceSelect from '~/components/common/DebounceSelect';
import ProductModule from '~/modules/product';
import useCreateBillStore from '~/store/createBillContext';
import { ItemSearchProduct } from '../bill.modal';
type propsType = {

}
export default function SelectProduct(props:propsType) : React.JSX.Element {
  const {onAdd} = useCreateBillStore();

    const fetchOptions = useCallback(async (keyword?: string) => {
        const products = await ProductModule.api.search({
          keyword,
          limit: 20,
        });
        console.log(products,'products');
        
        return products?.map((item: ItemSearchProduct) => ({
          label: get(item, "name"),
          value: get(item, "variant._id"),
          data : item,
        }));
      }, []);
    return (
        <DebounceSelect
        className='w-100' 
        size='large'
        fetchOptions={fetchOptions}
        placeholder="Nhập bất kì để tìm thuốc..."
        onChange={(value : any,{data}: any) => {
          const {name,cumulativeDiscount,_id:productId,variant,supplierId} = data;
          const submitData = {
            name,
            cumulativeDiscount, // Fixme
            productId,
            variantId : get(variant, "_id"),
            quantity : 1,
            totalPrice : get(variant, "price",0),
            supplierId,
          };
          onAdd(submitData)
        }}
        />
    )
}