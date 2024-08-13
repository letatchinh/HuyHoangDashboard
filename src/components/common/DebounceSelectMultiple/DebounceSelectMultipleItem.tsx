import { Flex, Select, Spin } from 'antd';
import { SelectProps } from 'antd/es/select/index';
import { debounce, get, unionBy } from 'lodash';
import React, { useEffect, useState } from 'react';
import pharmacyModule from "~/modules/pharmacy";
import { DSM_getOptions } from './DebounceSelectMultiple.service';
import useDebounceSelectMultipleStore from './DebounceSelectMultipleProvider';

interface propsType extends SelectProps {
    refCollection : "pharma_profile" | "partner";
}
export default function DebounceSelectMultipleItem({refCollection,...props}:propsType) : React.JSX.Element {
    const {DSM_setting} = useDebounceSelectMultipleStore();
    const [dataSource,setDataSource] = useState<any[]>([]);
    const [loading,setLoading] = useState(false);
    useEffect(() => {
        setDataSource(DSM_setting.dataSource[refCollection]);
        
    },[DSM_setting.dataSource.partner,DSM_setting.dataSource.pharma_profile]);

    const fetcher = async (keyword : string = "") => {
        try {
            
            if(!keyword) { // Clear Will Return Data Source Root
                setDataSource(DSM_setting.dataSource[refCollection]);
                return;
            };
            setLoading(true);
            const type : any =  refCollection === "pharma_profile" ? "pharma_profile" : "ctv";
            const dataFetcher = await pharmacyModule.api.search({
                type,
                keyword,
            });
            const data = DSM_getOptions(get(dataFetcher,'docs',[]));
            // Search Will 
            setDataSource(unionBy(data,DSM_setting.dataSource[refCollection],'value'));
            setLoading(false);
            
        } catch (error) {
            console.log(error,'error');
            setLoading(false);
        }
    };
    const debounceFetcher = debounce(fetcher,500);
    
    return (
        <Select 
        options={dataSource}
        allowClear
        showSearch
        {...loading && {dropdownRender : () => <Flex justify={'center'} align="center" style={{width : '100%',height : 200}}>
            <Spin />
        </Flex>}}
        onSearch={debounceFetcher}
        filterOption={() => true}
        {...props}
        />
    )
}