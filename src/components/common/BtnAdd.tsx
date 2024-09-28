import { PlusOutlined } from '@ant-design/icons';
import { Button, ButtonProps } from 'antd';
import React from 'react';

export default function BtnAdd(props:ButtonProps) : React.JSX.Element {
    return (
        <Button type='primary' icon={<PlusOutlined />} {...props}>
            Thêm mới
        </Button>
    )
}