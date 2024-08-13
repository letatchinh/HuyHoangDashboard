import { Popover, Typography } from 'antd';
import { ColumnsType } from "antd/es/table";
import { get } from 'lodash';
import React, { useMemo } from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import { getTextOfDiscount } from '~/utils/helpers';
import { formatter } from '~/utils/helpers';
type propsType = {
    value : number,
    dataSource : any[]
}
export default function CouponShow({value,dataSource}:propsType) : React.JSX.Element {
    const columns : ColumnsType = [
        {
            title : "Tên mã",
            dataIndex : 'name',
            key : 'name'
        },
        {
            title : "Giá trị giảm",
            dataIndex : 'discount',
            key : 'discount',
            align : 'center',
            render : (discount) => getTextOfDiscount(get(discount,'value'),get(discount,'type'))
        },
        {
            title : "Giảm tối đa",
            dataIndex : 'discount',
            key : 'maxDiscount',
            align : 'center',
            render : (discount) => discount?.maxDiscount ? formatter(discount?.maxDiscount || 0) : "Không giới hạn"
        },

    ]
    return (
        <Popover trigger={['click']} placement='left' content={<TableAnt pagination={false} dataSource={dataSource} columns={columns}/>}>
            <Typography.Link strong>{formatter(value)}</Typography.Link>
        </Popover>
    )
}