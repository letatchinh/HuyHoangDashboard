import { Button, Popconfirm } from 'antd';
import React from 'react';
import { useDeleteCondition } from '../benefitConfiguration.hook';
type propsType = {
    id?:any
}
export default function ConditionShowBenefitBase({id}:propsType) : React.JSX.Element {
    const [,deleteCondition] = useDeleteCondition();

    return (
        <Popconfirm
    title="Xoá điều kiện"
    onConfirm={() => deleteCondition({id})}
      >
        <Button type="text" >X-Y</Button>
      </Popconfirm>
    )
}