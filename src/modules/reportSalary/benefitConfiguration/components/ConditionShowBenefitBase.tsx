import { Button, Popconfirm } from 'antd';
import React from 'react';
import { useDeleteCondition } from '../benefitConfiguration.hook';
import useBenefitConfigStore from '../store/BenefitConfigContext';
type propsType = {
    id?:any
}
export default function ConditionShowBenefitBase({id}:propsType) : React.JSX.Element {
    const [,deleteCondition] = useDeleteCondition();
  const { canDeleteBenefit } = useBenefitConfigStore();

    return (
      canDeleteBenefit ?  <Popconfirm
    title="Xoá điều kiện"
    onConfirm={() => deleteCondition({id})}
      >
        <Button type="text" >X-Y</Button>
      </Popconfirm>
        : <Button type="text" >X-Y</Button>
    )
}