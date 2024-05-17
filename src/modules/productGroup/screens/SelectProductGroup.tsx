import { Select, SelectProps } from 'antd';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { filterSelectWithLabel, useFetchState } from '~/utils/helpers';
import apis from '../productGroup.api';
interface TypeProps extends SelectProps{
    defaultProductGroups? : any[],
};

export default function SelectProductGroups({defaultProductGroups,...props}:TypeProps) : React.JSX.Element {
  // const query = useMemo(() => ({
  //   page: 1,
  //   limit: 200,
  // }), []);
    const [productGroups,isLoading] = useFetchState({api : apis.getAllPublic,useDocs : false,shouldRun : !defaultProductGroups});
    const options = useMemo(() => ((defaultProductGroups ?? productGroups)?.map((item:any) => ({
        label : get(item,'name'),
        value : get(item,'_id')
    }))),[productGroups,defaultProductGroups]);
    return (
        <Select 
        options={options}
        loading={isLoading}
        allowClear
        style={{minWidth : 200}}
        placeholder="Nhóm sản phẩm"
        popupMatchSelectWidth={false}
        filterOption={filterSelectWithLabel}
        showSearch
        {...props}
        />
    )
};