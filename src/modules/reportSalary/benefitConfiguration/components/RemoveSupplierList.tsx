import { Button, Select } from 'antd';
import { get } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { filterOptionSlug } from '~/utils/helpers';
import { useDeleteBenefit } from '../benefitConfiguration.hook';
// import { BenefitType } from '../benefitConfiguration.modal';
import useBenefitConfigStore from '../store/BenefitConfigContext';
type propsType = {
    // dataCol?: BenefitType[],
    onCancel : () => void,
}
export default function RemoveSupplierList({onCancel}:propsType) : React.JSX.Element {
    const {dataRowCol} = useBenefitConfigStore();
    const [idSelect,setIdSelect] = useState();
    const onCallBack = useCallback(() => {
        onCancel && onCancel();
    },[])
    const [isSubmitLoading,deleteBenefit] = useDeleteBenefit(onCallBack);
    const options = useMemo(() => get(dataRowCol,'col',[])?.map((item:any) => ({
        label : `${get(item,'supplierId.code')} - ${get(item,'supplierId.name')}`,
        value : get(item,'_id')
    })),[get(dataRowCol,'col',[])]);

    const onRemoveBenefit = () => {
        deleteBenefit({id:idSelect})
    }
    return (
        <div>
            <Select showSearch filterOption={filterOptionSlug} value={idSelect} onChange={(value) => setIdSelect(value)} style={{width : 300}} options={options}/>
            <Button loading={isSubmitLoading} onClick={onRemoveBenefit} className='mt-2' type='primary'>
                Gỡ
            </Button>
        </div>
    )
}