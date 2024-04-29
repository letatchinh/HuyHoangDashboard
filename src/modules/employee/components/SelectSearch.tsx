import { Select, SelectProps } from 'antd';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { useFetchState } from '~/utils/helpers';
import apis from '../employee.api';
interface TypeProps extends SelectProps{
    defaultEmployee? : any[],
    keywordSearchEmployee?: string
};

export default function SelectEmployee({defaultEmployee,keywordSearchEmployee,...props}:TypeProps) : React.JSX.Element {
  const query = useMemo(() => ({
    page: 1,
    limit: 200,
  }), []);
    const [employee,isLoading] = useFetchState({api : apis.getALLAuthenticated,useDocs : true,shouldRun : !defaultEmployee, query});
    const options = useMemo(() => ((defaultEmployee ?? employee)?.map((item:any) => ({
        label : get(item,'fullName'),
        value : get(item,'_id')
    }))),[employee,defaultEmployee]);
    return (
        <Select 
        options={options}
        loading={isLoading}
        allowClear
        style={{minWidth : 200}}
        placeholder="Trình dược viên"
        popupMatchSelectWidth={false}
        {...props}
        />
    )
};