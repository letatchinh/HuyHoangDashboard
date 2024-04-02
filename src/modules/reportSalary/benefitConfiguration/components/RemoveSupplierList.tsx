import { Button, Select } from 'antd';
import { get } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { filterOptionSlug } from '~/utils/helpers';
import { useDeleteBenefit, useResetAction } from '../benefitConfiguration.hook';
import { GROUP_TYPE_BENEFIT_KPIS, TYPE_KPI_VI } from '../constants';
// import { BenefitType } from '../benefitConfiguration.modal';
import useBenefitConfigStore from '../store/BenefitConfigContext';
const CLONE_TYPE_KPI_VI : any = TYPE_KPI_VI;
type propsType = {
    // dataCol?: BenefitType[],
    onCancel : () => void,
}
export default function RemoveSupplierList({onCancel}:propsType) : React.JSX.Element {
    const {dataRowCol} = useBenefitConfigStore();
    useResetAction();
    const [idSelect,setIdSelect] = useState();
    const onCallBack = useCallback(() => {
        onCancel && onCancel();
    },[]);

    const [isSubmitLoading,deleteBenefit] = useDeleteBenefit(onCallBack);
    const options = useMemo(() => get(dataRowCol,'col',[])?.map((item:any) => ({
        label : `${get(item,'supplierId.code')} - ${get(item,'supplierId.name')}`,
        value : get(item,'_id'),
        item
    })),[get(dataRowCol,'col',[])]);

    const onRemoveBenefit = () => {
        deleteBenefit({id:idSelect})
    };

    return (
        <div>
            <Select
            popupMatchSelectWidth={false}
            optionRender={({label,data}) => {
                
                const {item} = data || {};
                if(GROUP_TYPE_BENEFIT_KPIS.includes(get(item,'typeBenefit'))){
                    return <div>
                    <p>{label}</p>
                    <i>({CLONE_TYPE_KPI_VI[get(item,'kpiType')]})</i>
                </div>
                }

                return <div>
                    <p>{label}</p>
                </div>
            }}
            showSearch filterOption={filterOptionSlug} value={idSelect} onChange={(value) => setIdSelect(value)} style={{width : 300}} options={options}/>
            <Button loading={isSubmitLoading} onClick={onRemoveBenefit} className='mt-2' type='primary'>
                Gỡ
            </Button>
        </div>
    )
}