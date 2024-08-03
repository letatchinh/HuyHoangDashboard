import { InputNumber, InputNumberProps } from 'antd';
import React from 'react';
import { formatter } from '~/utils/helpers';
export default function InputNumberAnt(props:InputNumberProps) : React.JSX.Element {
    return (
        <InputNumber {...props} style={{ width: "100%" }} formatter={(value:any) => formatter(value)}/>
    )
}