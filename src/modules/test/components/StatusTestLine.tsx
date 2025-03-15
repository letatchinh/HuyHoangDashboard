import { Tag } from 'antd';
import React from 'react';
type propsType = {
    status: "ACTIVE" | "INACTIVE"
}
export default function StatusTestLine(props:propsType) : React.JSX.Element {
    if(props.status === "ACTIVE"){
        return <Tag color='green' style={{width:120 ,textAlign:"center"}}>Hoạt động</Tag>
    }
    if(props.status === "INACTIVE"){
        return <Tag color='red' style={{width:120 ,textAlign:"center"}}>Ngừng hoạt động</Tag>
    }

    return (
        <div>{props.status}</div>
    )
}