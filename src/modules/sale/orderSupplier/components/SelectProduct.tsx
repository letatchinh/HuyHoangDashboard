import { GiftFilled, GiftTwoTone, SearchOutlined, StopOutlined } from '@ant-design/icons';
import { AutoComplete, Badge, Empty, Tag, Typography } from 'antd';
import { debounce, get } from 'lodash';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { v4 } from 'uuid';
import TableAnt from '~/components/Antd/TableAnt';
import ProductModule from '~/modules/product';
import useNotificationStore from '~/store/NotificationContext';
import { formatter } from '~/utils/helpers';
import { selectProductSearch } from '../../bill/bill.service';
import ImageProduct from '../../bill/components/ImageProduct';
import { ItemSearchProduct } from '../orderSupplier.modal';
import { getCumulativeDiscount } from '../orderSupplier.service';
type propsType = {
  dataCurrent : any,
  onChangeBill : (newData:any) => void,
}
export default function SelectProduct({dataCurrent,onChangeBill}:propsType) : React.JSX.Element {
  const {onNotify} = useNotificationStore();
  const [dataSearch,setDataSearch] = useState([]);
  const [loading,setLoading] = useState(false);
  const inputEl : any = useRef(null);

  const onAdd = (row: any) => {
    const orderSupplierItems = get(dataCurrent,'orderSupplierItems',[]);
    const newData = [
      ...orderSupplierItems,
      { ...row, key: v4() },
    ];
    onChangeBill({
      orderSupplierItems : newData
    })
  };
  
    const fetchOptions = async (keyword?: string) => {
        try {
          setLoading(true);
          const products = await ProductModule.api.search({
            keyword,
            limit: 20,
            supplierId : get(dataCurrent,'supplierId'),
            optionWith : 'supplier'
          }); 
          const newDataSearch = products?.map((item: ItemSearchProduct) => ({
            ...item,
            variant : get(item,'variants',[])?.find((variant:any) => get(variant, "_id") === get(item,'selectVariant'))
            
          }));
          setDataSearch(newDataSearch);
          setLoading(false);
        } catch (error : any) {
          setLoading(false);
          onNotify?.error(error?.response?.data?.message || "Có lỗi gì đó xảy ra")
        }
      }
      const debounceFetcher = debounce(fetchOptions, 300);
      const onSelect = async(data:any) => {
          try {
            inputEl.current.blur();
          const orderSupplier : any = selectProductSearch(data);
          const cumulativeDiscount = await getCumulativeDiscount({supplierId : get(dataCurrent,'supplierId'),orderSupplierItems : [orderSupplier]});
          const orderSupplierWithCumulative = {
            ...orderSupplier,
            cumulativeDiscount : cumulativeDiscount?.[get(orderSupplier,'productId')] ?? []
          }
          onAdd(orderSupplierWithCumulative)
          } catch (error : any) {
            onNotify?.error(error?.response?.data?.message || "Có lỗi gì đó xảy ra");
          }
      };
      useEffect(() => {
        if(get(dataCurrent,'supplierId')){
            debounceFetcher('')
        }
      },[get(dataCurrent,'supplierId')]);
      const mappingProductId : { [key: string]: boolean } = useMemo(() => {
        let mapProductId : any = {};
        get(dataCurrent,'orderSupplierItems',[])?.forEach((item:any) => {
          mapProductId[get(item,'productId')] = true;
        });
        return mapProductId;
      },[dataCurrent]);
      
    return (
        <AutoComplete
        allowClear
        size='large'
        ref={inputEl}
        onSearch={(kw) => debounceFetcher(kw)}
        disabled={!get(dataCurrent,'supplierId')}
        notFoundContent={<div><Empty /></div>}
        style={{width : 300}}
        popupMatchSelectWidth={600}
        placeholder={!get(dataCurrent,'supplierId') ? <Typography.Text strong style={{color : 'white'}}><StopOutlined/> Vui lòng Chọn nhà cung cấp trước</Typography.Text> :<span><SearchOutlined /> Thêm sản phẩm vào đơn</span>}
        dropdownRender={() => {
          return (
            <TableAnt
              scroll={{ y: 450 }}
              className="table-searchProduct"
              rowClassName={(record) => {
                const isDisabled = get(mappingProductId,get(record, "_id"))
                return isDisabled ? "disabled-row" : ""
              }}
              size="small"
              loading={loading}
              dataSource={dataSearch}
              pagination={false}
              rowKey={rc => rc._id}
              columns={[
                {
                  title: "",
                  dataIndex: "images",
                  key: "images",
                  align:'center',
                  width : 80,
                  render: (images: any, record: any, index: number) => <ImageProduct images={images}/>
                },
                {
                  title: 'Tên thuốc',
                  dataIndex: 'name',
                  key: 'name',
                  render(name, record, index) {
                    const isDisabled = get(mappingProductId,get(record, "_id"))
                    return <span>
                      <Typography.Text strong>{get(record,'codeBySupplier','')}</Typography.Text>
                      <span> - {name}</span>
                      {isDisabled && <Tag color={'blue'} bordered={false}>Đã chọn</Tag>}
                    </span>
                  },
                },
                {
                  title: 'Giá bán',
                  dataIndex: 'variant',
                  key: 'variant',
                  align: 'center',
                  render(variant, record, index) {
                    return <Typography.Text strong>{formatter(get(variant,'price',0))} 
                    &nbsp;
                    {get(record,'cumulativeDiscount.length',0) ? <Badge size='small' count={get(record,'cumulativeDiscount.length',0)}>
                      <GiftTwoTone />
                      </Badge> : null}
                      </Typography.Text>
                  },
                },
              ]}
              onRow={record => {
              
                return {
                  onClick: () => {
                    onSelect(record);
                  },
                };
              }}
            />
          );
        }}
      />
    )
}