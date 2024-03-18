import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Popover, Select, Tooltip } from 'antd';
import { get } from 'lodash';
import React, { useCallback, useMemo, useState } from 'react';
import { filterOptionSlug } from '~/utils/helpers';
import { useFetchState } from '~/utils/hook';
import apis from '../benefitConfiguration.api';
import { actionByType } from '../benefitConfiguration.service';
import { TYPE_KPI } from '../constants';
import useBenefitConfigStore from '../store/BenefitConfigContext';
type propsType = {

}
export default function SelectSupplierNotExist() : React.JSX.Element {
    const {typeBenefit,reFetch,createBenefit,isSubmitLoading} = useBenefitConfigStore();
    const [data,loading] = useFetchState({api : apis.getSupplierToAddBenefit,useDocs : false,query : typeBenefit,reFetch});
    const [idSelect,setIdSelect] = useState<string | null>();
    const [open, setOpen] = useState(false);
    const hide = useCallback(() => {
        setOpen(false);
    },[]);
    const handleOpenChange = (newOpen:boolean) => {
      setOpen(newOpen);
    };
    const options = useMemo(() => data?.map((item:any) => ({
        label : `${get(item,'code')} - ${get(item,'name')}`,
        value : get(item,'_id')
    })),[data]);
    const onCreateBenefit = useCallback(() => {
        actionByType({
            typeBenefit,
            actionBenefit : () => createBenefit({supplierId:idSelect,typeBenefit}),
            actionBenefitOver : () => createBenefit({supplierId:idSelect,typeBenefit}),
            actionKpis:() => createBenefit({
                supplierId: idSelect,
                typeBenefit,
                kpiType: TYPE_KPI.COVER_POS, // Default TYPE_KPI.COVER_POS
              }),
            actionBenefitWorking :() => createBenefit({supplierId:idSelect,typeBenefit})
        });
        hide();
        setIdSelect(null)
    },[createBenefit,idSelect]);
    return (
        <Popover
        content={<div>
            <Select popupMatchSelectWidth={false} showSearch filterOption={filterOptionSlug} loading={loading} value={idSelect} onChange={(value) => setIdSelect(value)} style={{width : 300}} options={options}/>
            <Button loading={isSubmitLoading} onClick={onCreateBenefit} className='mt-2' type='primary'>
                Thêm
            </Button>
        </div>}
        title="Chọn nhà cung cấp!"
        trigger="click"
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Tooltip title="Thêm nhà cung cấp" placement='bottom'>
        <Button icon={<PlusCircleOutlined />} type='primary' block/> 
        </Tooltip>
      </Popover>
    )
}