import { Button } from 'antd';
import React, { useCallback } from 'react';
import { useCreateCondition } from '../benefitConfiguration.hook';
import useBenefitConfigStore from '../store/BenefitConfigContext';
type propsType = {
    canCreate : boolean
}
export default function CreateConditionBenefitBase({canCreate}:propsType) : React.JSX.Element {
    const {typeBenefit} = useBenefitConfigStore();
    const [isSubmitLoading,createCondition] = useCreateCondition();

    const onCreateCondition = useCallback(() => {
        createCondition({
            typeBenefit,
        })
    },[typeBenefit])
    return (
        canCreate ?
        <Button loading={isSubmitLoading} className="mb-2" type="primary" shape='round' onClick={onCreateCondition}>
          Thêm điều kiện
        </Button>
        : <></>
    )
}