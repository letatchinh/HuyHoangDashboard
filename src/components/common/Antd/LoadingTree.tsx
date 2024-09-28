import { DownOutlined } from '@ant-design/icons';
import { Skeleton, Tree } from 'antd';
import { range } from 'lodash';
import React, { useMemo } from 'react';
type propsType = {
  sample ?:{current?:number,pageSize?:number}
}
export default function LoadingTree(props:propsType) : React.JSX.Element {
  const createDataSample= useMemo(()=>{
    return range(props?.sample?.pageSize??10).map((el)=>({
      title: 'parent '+ el,
      key: '0-'+el
    }))
  },[props?.sample?.pageSize])
    return (
        <Tree
        showLine
        className='tree-custom'
        switcherIcon={<DownOutlined />}
        treeData={createDataSample}
        titleRender={node => <Skeleton.Input />}
      />
    )
}