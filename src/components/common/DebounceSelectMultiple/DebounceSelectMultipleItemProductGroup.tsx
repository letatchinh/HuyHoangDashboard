import { Select } from 'antd';
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

    const dataSourceDisabled = dataSource?.map((item) => ({
        ...item,
        disabled: DSM_setting.values[refCollection]?.includes(item?.value) && item?.value !== props.value,
      }));
      
    return (
        <Select 
        options={dataSourceDisabled}
        allowClear
        showSearch
        filterOption={filterOptionSlug}
        {...props}
        />
    )
}