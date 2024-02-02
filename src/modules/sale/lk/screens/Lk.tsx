import { Button, Flex, Typography } from 'antd';
import { ColumnsType } from 'antd/es/table/InternalTable';
import { get } from 'lodash';
import React from 'react';
import SearchAnt from '~/components/Antd/SearchAnt';
import TableAnt from '~/components/Antd/TableAnt';
import WhiteBox from '~/components/common/WhiteBox';
import { formatter } from '~/utils/helpers';
import { useGetLks, useLkPaging, useLkQueryParams, useUpdateLkParams } from '../lk.hook';
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
            },
            {
                code : "BILL0002",
                totalAmount : 20000,
            },
        ]
    }
]
type propsType = {

}
export default function Lk(props:propsType) : React.JSX.Element {
    // Hook
//   const [query] = useLkQueryParams();
//   const [keyword, { setKeyword, onParamChange }] =
//     useUpdateLkParams(query);
//   const [data, isLoading] = useGetLks(query);
//   const paging = useLkPaging();
    const columns : ColumnsType = [
        {
            title : "Mặt hàng",
            dataIndex : "name",
            key : "name",
        },
        {
            title : "Chương trình luỹ kế",
            dataIndex : "cumulativeDiscount",
            key : "cumulativeDiscount",
            render(cumulativeDiscount, record, index) {
                return <span>{get(cumulativeDiscount,'name')}</span>
            },
        },
        {
            title : "Nhà thuốc",
            dataIndex : "pharmacy",
            key : "pharmacy",
            align : 'center',
            render(pharmacy, record, index) {
                return <span>{get(pharmacy,'name')}</span>
            },
        },
        {
            title : "Đơn hàng",
            dataIndex : "bills",
            key : "bills",
            align : 'center',
            render(bills, record, index) {
                return <Flex vertical>
                    {bills?.map((bill:any) => <span>{get(bill,'code')} - <Typography.Text strong>{formatter(get(bill,'totalAmount'))}</Typography.Text></span>)}
                </Flex>
            },
        },
        {
            title : "Thao tác",
            dataIndex : "_id",
            key : "action",
            align : 'center',
            render(_id, record, index) {
                return <Button size='small' type='primary'>
                    Tạo Phiếu chi
                </Button>
            },
        },

    ]
    return (
        <div>
            <h5>Các mặt hàng luỹ kế đã tích luỹ</h5>
            <WhiteBox>
                {/* <SearchAnt onParamChange={}/> */}
                <TableAnt dataSource={data} columns={columns} size='small'/>
            </WhiteBox>
        </div>
    )
}