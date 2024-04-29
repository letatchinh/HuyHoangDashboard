import { Select, SelectProps } from 'antd';
import { get } from 'lodash';
import React, { useMemo } from 'react';
import { useFetchState } from '~/utils/helpers';
import apis from '../collaborator.api';
interface TypeProps extends SelectProps{
    defaultCollaborator? : any[],
    keywordSearchCollaborator?: string
};

export default function SelectCollaborator({defaultCollaborator,keywordSearchCollaborator,...props}:TypeProps) : React.JSX.Element {
  // const query = useMemo(() => ({
  //   page: 1,
  //   limit: 200,
  // }), []);
    const [collaborator,isLoading] = useFetchState({api : apis.getALLAuthenticated,useDocs : false,shouldRun : !defaultCollaborator});
    const options = useMemo(() => ((defaultCollaborator ?? collaborator)?.map((item:any) => ({
        label : get(item,'fullName', 'name'),
        value : get(item,'_id')
    }))),[collaborator,defaultCollaborator]);
    return (
        <Select 
        options={options}
        loading={isLoading}
        allowClear
        style={{minWidth : 200}}
        placeholder="Cộng tác viên"
        popupMatchSelectWidth={false}
        {...props}
        />
    )
};