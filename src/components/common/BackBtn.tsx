import { LeftOutlined } from '@ant-design/icons';
import React from 'react';
import { Link } from 'react-router-dom';
type propsType = {
    path : string,
    label : any,
}
export default function BackBtn({path,label}:propsType) : React.JSX.Element {
    return (
        <Link  className="link_" to={path}>
        <LeftOutlined /> {label}
      </Link>
    )
}