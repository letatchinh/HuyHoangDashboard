import { Button, Flex, InputNumber } from 'antd';
import React, { useCallback, useState } from 'react';
import { useCreateConfig, useResetAction } from '../benefitConfiguration.hook';
type propsType = {
    defaultValue:number;
    hide: () => void;
    conditionId?: any;
    benefitId?: any;
    mutate : () => void;
}
export default function FormValue({defaultValue,benefitId,conditionId,hide,mutate}:propsType) : React.JSX.Element {
    useResetAction();
    const [value, setValue] = useState(defaultValue);
    const onCallBack = useCallback(() => {
        hide();
        mutate && mutate();
    },[mutate])
    const [isSubmitLoading,createConfig] = useCreateConfig(onCallBack);
    
    const onCreateConfig = () => {
      const submitData = {
        reportBenefitId: benefitId,
        reportConditionId: conditionId,
        value,
      };
      createConfig(submitData);
    };
    return (
        <Flex>
          <InputNumber
            min={0}
            max={100}
            value={value}
            onChange={(v: any) => setValue(v)}
            onPressEnter={onCreateConfig}
          />
          <Button
            loading={isSubmitLoading}
            type="primary"
            onClick={onCreateConfig}
          >
            Sửa
          </Button>
        </Flex>
    )
}