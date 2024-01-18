import { SearchOutlined } from '@ant-design/icons';
import { Typography } from 'antd';
import { get } from 'lodash';
import React from 'react';
import { v4 } from 'uuid';
import DebounceSelect from '~/components/common/DebounceSelect';
import ProductModule from '~/modules/product';
import useNotificationStore from '~/store/NotificationContext';
import { ItemSearchProduct } from '../bill.modal';
import { getCumulativeDiscount, selectProductSearch } from '../bill.service';
type propsType = {
  dataCurrent : any,
  onChangeBill : (newData:any) => void,
}
export default function SelectProduct({dataCurrent,onChangeBill}:propsType) : React.JSX.Element {
  const {onNotify} = useNotificationStore();
  const onAdd = (row: any) => {
    const billItems = get(dataCurrent,'billItems',[]);
    const newData = [
      ...billItems,
      { ...row, key: v4() },
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
          console.log(dataCurrent,'dataCurrent');
          
          const newOptions = products?.map((item: ItemSearchProduct) => ({
            label: `${get(item, "name")} - ${get(item, "supplier.name")}`,
            value: get(item, "selectVariant"),
            data : item,
            disabled : get(dataCurrent,'billItems',[])?.some((billItem : any) => get(billItem, "variantId") === get(item, "selectVariant")),
          }));
          return newOptions;
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
        value={null}
        placeholder={!get(dataCurrent,'pharmacyId') ? <Typography.Text strong type='secondary'>Vui lòng Chọn nhà thuốc trước</Typography.Text> :<span><SearchOutlined /> Thêm sản phẩm vào đơn</span>}
        onChange={async(value : any,option: any) => {
          if(!option){
            return;
          }
          const {data} = option;
          const billItem : any = selectProductSearch(data);
          const cumulativeDiscount = await getCumulativeDiscount({pharmacyId : get(dataCurrent,'pharmacyId'),billItems : [billItem]});
          const billItemWithCumulative = {
            ...billItem,
            cumulativeDiscount : cumulativeDiscount?.[get(billItem,'productId')] ?? []
          }
          onAdd(billItemWithCumulative)
        }}
        />
    )
}