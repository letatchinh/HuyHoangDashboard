import { Select, SelectProps } from 'antd';
import React, { useMemo } from 'react';
import { filterOptionSlug, useFetchState } from '~/utils/helpers';
import apis from '../courseGroup.api';
import { CourseGroupBase } from '../courseGroup.modal';
export default function CourseGroupSelect(props:SelectProps) : React.JSX.Element {
    const [data,loading] = useFetchState({api : apis.getAll,useDocs : false});
    const options = useMemo(() => data?.map((item : CourseGroupBase) => ({
        label : item?.name,
        value : item?._id
    })),[data])
    return (
        <Select options={options} filterOption={filterOptionSlug} loading={loading} {...props}/>
    )
}