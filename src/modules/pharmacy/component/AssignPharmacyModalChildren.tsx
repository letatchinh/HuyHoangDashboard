import { get } from 'lodash';
import React, { useEffect, useState } from 'react';
import BaseBorderBox from '~/components/common/BaseBorderBox/index';
import WithOrPermission from '~/components/common/WithOrPermission';
import POLICIES from '~/modules/policy/policy.auth';
import { DataSourceItemType } from '../pharmacy.modal';
import AssignPharmacy from './AssignPharmacy';
import AssignPharmacyList from './AssignPharmacyList';
type propsType = {
    initDataSource : DataSourceItemType[],
    setForm : (p:string[]) => void,
    id? : string
}
export default function AssignPharmacyModalChildren({initDataSource,setForm,id}:propsType) : React.JSX.Element {
    
    const [dataSource,setDataSource] = useState<DataSourceItemType[]>([]);
    

    // Get Initialized DataSource From Get By Id Data
        useEffect(() => {
            setDataSource(initDataSource);
        },[initDataSource]);

        // Change Form Value After Change dataSource
        useEffect(() => {
            let newIds : string[] = dataSource?.map((item:DataSourceItemType) => get(item,'_id'));
            // handle Convert DataSource To ids
            setForm(newIds)
        },[dataSource]);

        // Handle Add DataSource
        const onAddDataSource = (newDataSource:DataSourceItemType) => {
            setDataSource([newDataSource,...dataSource]);
        }

        // Handle Remove DataSource
        const onRemoveDataSource = (id:string) => {
            setDataSource(dataSource?.filter((item : DataSourceItemType) => get(item,'_id') !== id));
        }
    return (
        <>
        <BaseBorderBox title={"Danh sách khách hàng B2B đã chọn"}>
        <AssignPharmacyList onRemove={onRemoveDataSource} dataSource={dataSource}/>
        </BaseBorderBox>
        <WithOrPermission permission={[POLICIES.UPDATE_UPDATETHEPHARMACYFOREMPLOYEE,POLICIES.WRITE_UPDATETHEPHARMACYFOREMPLOYEE]}>
        <AssignPharmacy id={id} dataSource={dataSource} onChange={onAddDataSource}/>
        </WithOrPermission>
        </>
    )
}