import { SearchOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { get } from 'lodash';
import React from 'react';
import DebounceSelect from '~/components/common/DebounceSelect';
import ProductModule from '~/modules/product';
import useNotificationStore from '~/store/NotificationContext';
import { ItemSearchProduct } from '../bill.modal';
type propsType = {
  dataCurrent : any,
  onChangeBill : (newData:any) => void,
}
export default function SelectProduct({dataCurrent,onChangeBill}:propsType) : React.JSX.Element {
  const {onNotify} = useNotificationStore();
  const onAdd = (row: any) => {
    const clonedDataSource = get(dataCurrent,'billItems',[]);
    const newData = [
      ...clonedDataSource,
      { ...row, key: clonedDataSource.length + 1 },
    ];
    onChangeBill({
      billItems : newData
    })
  };

    const fetchOptions = async (keyword?: string) => {
        try {
          const products = await ProductModule.api.search({
            keyword,
            limit: 20,
            pharmacyId : get(dataCurrent,'pharmacyId'),
          }); 
          return products?.map((item: ItemSearchProduct) => ({
            label: `${get(item, "name")} - ${get(item, "supplier.name")}`,
            value: get(item, "selectVariant"),
            data : item,
          }));
        } catch (error : any) {
          onNotify?.error(error?.response?.data?.message || "Có lỗi gì đó xảy ra")
        }
      }
      
    return (
        <DebounceSelect
        suffixIcon={null}
        disabled={!get(dataCurrent,'pharmacyId')}
        className='w-100' 
        size='large'
        fetchOptions={fetchOptions}
        placeholder={!get(dataCurrent,'pharmacyId') ? <Typography.Text strong type='secondary'>Vui lòng Chọn nhà thuốc trước</Typography.Text> :<span><SearchOutlined /> Thêm sản phẩm vào đơn</span>}
        onChange={(value : any,option: any) => {
          if(!option){
            return;
          }
          const {data} = option;
          const {name,cumulativeDiscount,_id:productId,variants,supplierId,selectVariant} = data;
          const variant = variants?.find((item:any) => get(item,'_id') === selectVariant)
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