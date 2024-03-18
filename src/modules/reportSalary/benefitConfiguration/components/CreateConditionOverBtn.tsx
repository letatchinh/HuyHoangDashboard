import { Button } from 'antd';
import React, { useCallback } from 'react';
import { useCreateCondition } from '../benefitConfiguration.hook';
import useBenefitConfigStore from '../store/BenefitConfigContext';
import { GROUP_TYPE_BENEFIT_OVER_MONTH,GROUP_TYPE_BENEFIT_OVER_QUARTER, GROUP_TYPE_BENEFIT_OVER_YEAR} from '../constants';
type propsType = {
    canCreate : boolean
}
const CLONE_GROUP_TYPE_BENEFIT_OVER_MONTH : any = GROUP_TYPE_BENEFIT_OVER_MONTH;
const CLONE_GROUP_TYPE_BENEFIT_OVER_QUARTER : any = GROUP_TYPE_BENEFIT_OVER_QUARTER;
const CLONE_GROUP_TYPE_BENEFIT_OVER_YEAR : any = GROUP_TYPE_BENEFIT_OVER_YEAR;
export default function CreateConditionBenefitBase({canCreate}:propsType) : React.JSX.Element {
    const {typeBenefit} = useBenefitConfigStore();
    
    const [isSubmitLoading,createCondition] = useCreateCondition();

    const onCreateCondition = useCallback(() => {
        let over = '';
        
        switch (true) {
            case CLONE_GROUP_TYPE_BENEFIT_OVER_MONTH.includes(typeBenefit):
                over = 'month'
                break;
            case CLONE_GROUP_TYPE_BENEFIT_OVER_QUARTER.includes(typeBenefit):
                over = 'quarter'
                break;
            case CLONE_GROUP_TYPE_BENEFIT_OVER_YEAR.includes(typeBenefit):
                over = 'year'
                break;
            default:
                break;
        };
        
        createCondition({
            typeBenefit,
            cond : {
                over,
            }

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