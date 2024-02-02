import { ColumnsType } from 'antd/es/table/InternalTable';
import React from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import WhiteBox from '~/components/common/WhiteBox';
const data = [
    {
        name:"Thuốc A",
        pharmacy : {
            name : "NT A"
        },
        cumulativeDiscount : {
            name : "LK A"
        },
        bills : [
            {
                code : "BILL0001",
                totalAmount : 10000,
            }
        ]
    }
]
type propsType = {

}
export default function Lk(props:propsType) : React.JSX.Element {
    const columns : ColumnsType = [
        {
            title : "Mặt hàng",
            dataIndex : "name",
            key : "name",
        }
    ]
    return (
        <div>
            <WhiteBox>
                <TableAnt dataSource={data}/>
            </WhiteBox>
        </div>
    )
}