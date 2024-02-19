import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table/InternalTable';
import React from 'react';
import TableAnt from '~/components/Antd/TableAnt';
import { formatter } from '~/utils/helpers';
import { useGetReportSuppliers, useReportSupplierPaging, useReportSupplierQueryParams, useUpdateReportSupplierParams } from '../reportSupplier.hook';
type propsType = {

}
const data = [
    {
        name : "Long châu",
        totalAmount : 100000,
    },
    {
        name : "UPharmacy",
        totalAmount : 200000,
    },
];
const columns : ColumnsType = [
    {
        title : "Nhà cung cấp",
        dataIndex : 'name',
        key : 'name',
    },
    {
        title : "Doanh thu",
        dataIndex : 'totalAmount',
        key : 'totalAmount',
        render(totalAmount, record, index) {
            return formatter(totalAmount)
        },
    },
]
export default function ReportSupplier(props:propsType) : React.JSX.Element {
    const [query] = useReportSupplierQueryParams();
    const [keyword, { setKeyword, onParamChange }] =
      useUpdateReportSupplierParams(query);
    // const [data, isLoading] = useGetReportSuppliers(query);
    const paging = useReportSupplierPaging();
    return (
        <div>
            <h4 >Báo cáo doanh thu của nhà cung cấp</h4>
            <TableAnt 
        dataSource={data}
        columns={columns}
        pagination={{
            ...paging,
            showTotal: (total) => `Tổng cộng ${total}`,
            showSizeChanger: true,
        }}
        size='small'
        />
        </div>
    )
}