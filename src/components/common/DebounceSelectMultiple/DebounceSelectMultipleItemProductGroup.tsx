import { Flex, Select, Spin } from 'antd';
import { SelectProps } from 'antd/lib/index';
import React, { useEffect, useState } from 'react';
import { filterOptionSlug } from '~/utils/helpers';
import useDebounceSelectMultipleStore from './DebounceSelectMultipleProvider';

const refCollection = 'productGroup';
export default function DebounceSelectMultipleItemProductGroup(props : SelectProps) : React.JSX.Element {
    const {DSM_setting} = useDebounceSelectMultipleStore();
    const [dataSource,setDataSource] = useState<any[]>([]);

    // Init Data Source From Store
    useEffect(() => {
        setDataSource(DSM_setting.dataSource[refCollection]);
    },[DSM_setting]);

    
    return (
        <Select 
        options={dataSource}
        allowClear
        showSearch
        filterOption={filterOptionSlug}
        {...props}
        />
    )
}