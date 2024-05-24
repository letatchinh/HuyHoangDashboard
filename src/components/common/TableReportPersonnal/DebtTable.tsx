import { ColumnsType } from 'antd/es/table';
import React from 'react';
import { formatter } from '~/utils/helpers';
import WhiteBox from '../WhiteBox';
import TableAnt from '~/components/Antd/TableAnt';
type propsType = {
    data?: any;
    pagination?: any;
    isLoading?: boolean;
}
export default function DebtTable(props:propsType) : React.JSX.Element {
    const { data, pagination, isLoading } = props;
    const columns: ColumnsType = [
        // {
        //   title: "STT",
        //   key: "index",
        //   width: 50,
        //   render: (text, record, index) => {
        //     return (+newMemoOfDetail.page - 1) * newMemoOfDetail.limit + index + 1;
        //   },
        // },
    
        {
            title: "Chu kì",
            dataIndex: "createdAt",
            key: "createdAt",
            width: 120,
          },
        {
          title: "Giá trị đơn hàng",
          dataIndex: "totalPrice",
          key: "totalPrice",
          width: 200,
          render(value) {
            return formatter(value);
          },
        },
        {
          title: "Công nợ",
          dataIndex: "resultDebt",
          key: "resultDebt",
          width: 120,
          render(value) {
            return formatter(value);
          },
        },
      ];
    return (
        <WhiteBox>
        <TableAnt
          dataSource={data || []}
          loading={isLoading}
          rowKey={(rc) => rc?._id}
          columns={columns}
          size="small"
          pagination={pagination}
          stickyTop
        />
      </WhiteBox>
    )
}