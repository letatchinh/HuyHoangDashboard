import { PlusCircleFilled } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { PATH_APP } from '~/routes/allPath';
type propsType = {

}
export default function Bill(props:propsType) : React.JSX.Element {
    const navigate = useNavigate();
    return (
        <div>
            Danh sách đơn hàng
        </div>
    )
}