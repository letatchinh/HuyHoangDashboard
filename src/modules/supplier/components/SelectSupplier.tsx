import { Select, SelectProps } from 'antd';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { useFetchState } from '~/utils/helpers';
import apis from '../supplier.api';
export default function SelectSupplier(props:SelectProps) : React.JSX.Element {
    const [suppliers,isLoading] = useFetchState({api : apis.getAllPublic,useDocs : false});
    const options = useMemo(() => suppliers?.map((item:any) => ({
        label : get(item,'name'),
        value : get(item,'_id')
    })),[suppliers]);
    return (
        <Select 
        options={options}
        loading={isLoading}
        allowClear
        style={{minWidth : 200}}
        placeholder="Nhà cung cấp"
        {...props}
        />
    )
}