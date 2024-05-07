import { Select, SelectProps } from 'antd';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { filterSelectWithLabel, useFetchState } from '~/utils/helpers';
import apis from '../user.api';
interface TypeProps extends SelectProps{
    defaultUsers? : any[],
};

export default function SelectUser({defaultUsers,...props}:TypeProps) : React.JSX.Element {
  // const query = useMemo(() => ({
  //   page: 1,
  //   limit: 200,
  // }), []);
    const [users,isLoading] = useFetchState({api : apis.getAll,useDocs : true,shouldRun : !defaultUsers});
    const options = useMemo(() => ((defaultUsers ?? users)?.map((item:any) => ({
        label : get(item,'fullName', 'name'),
        value : get(item,'_id')
    }))),[users,defaultUsers]);
    return (
        <Select
            options={options}
            loading={isLoading}
            allowClear
            style={{ minWidth: 200 }}
            placeholder="Nhân viên"
            popupMatchSelectWidth={false}
            filterOption={filterSelectWithLabel}
            showSearch
        {...props}
        />
    )
};