import { Select, SelectProps } from 'antd';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { filterSelectWithLabel, useFetchState } from '~/utils/helpers';
import apis from '../supplier.api';
interface TypeProps extends SelectProps{
    defaultSuppliers? : any[]
}
export default function SelectSupplier({defaultSuppliers,...props}:TypeProps) : React.JSX.Element {
    const [suppliers,isLoading] = useFetchState({api : apis.getAllPublic,useDocs : false,shouldRun : !defaultSuppliers});
    const options = useMemo(() => (defaultSuppliers ?? suppliers)?.map((item:any) => ({
        label : get(item,'name'),
        value : get(item,'_id')
    })),[suppliers,defaultSuppliers]);
    return (
        <Select 
        options={options}
        loading={isLoading}
        allowClear
        style={{minWidth : 200}}
        placeholder="Nhà cung cấp"
        popupMatchSelectWidth={false}
        filterOption={filterSelectWithLabel}
        {...props}
        />
    )
}