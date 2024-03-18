import { Button, Popconfirm } from 'antd';
import React, { useMemo } from 'react';
import { useDeleteCondition } from '../benefitConfiguration.hook';
type propsType = {
    cond : any,
    id?:any
}
export default function ConditionOver({cond,id}:propsType) : React.JSX.Element {
    const {over} = cond || {};
    const [,deleteCondition] = useDeleteCondition();
    const time :string= useMemo(() => {
        let t = '';
        switch (over) {
            case 'month':
                t = 'Tháng'
                break;
            case 'quarter':
                t = 'Quý'
                break;
            case 'year':
                t = 'năm'
                break;
        
            default:
                break;
        };
        return t;
    },[over]);
    return <Popconfirm
    title="Xoá điều kiện"
    onConfirm={() => deleteCondition({id})}
      >
        <Button type="text" >Vượt doanh số {time}</Button>
      </Popconfirm>
}