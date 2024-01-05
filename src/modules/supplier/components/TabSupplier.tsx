import { Tabs,TabsProps } from 'antd';
import React, { useMemo } from 'react';
import { propsTypeTabSupplier } from '../supplier.modal';
import FormSupplier from './FormSupplier';
import ListProduct from './ListProduct';
import Report from './Report';


export default function TabSupplier({id,onCancel,onUpdate,isSubmitLoading}:propsTypeTabSupplier) : React.JSX.Element {
    const Items : TabsProps['items'] = useMemo(() => {
        let items : TabsProps['items']= [
            {
                label : "Thông tin",
                key : '0',
                children : <FormSupplier onUpdate={onUpdate} isSubmitLoading={isSubmitLoading} id={id} onCancel={onCancel}/>,
            },
        ];
        if(id){
            items = [...items,{
                label : "Danh sách sản phẩm",
                key : '1',
                children : <ListProduct />
            },
            {
                label : "Báo cáo",
                key : '2',
                children : <Report />
            },]
        }
        return items
    },[id]);
    console.log(id,'id');
    
    return (
        <Tabs
        defaultActiveKey="0"
        type="card"
        items={Items}
      />
    )
}