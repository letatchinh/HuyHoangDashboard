import { ColumnsType } from "antd/es/table";
import React from "react";
import TableAnt from "~/components/Antd/TableAnt";
import WhiteBox from "~/components/common/WhiteBox";
import { formatter } from "~/utils/helpers";
type propsType = {
  query?: any;
  data?: any;
  pagination?: any;
  isLoading?: boolean;
};
export default function BillAndDebtTable(props: propsType): React.JSX.Element {
  const { query, data, pagination, isLoading } = props;
  const columns: ColumnsType = [
    ...(query?.datatype?.includes("reportRangerType")
      ? [
          {
            title: "Chu kì",
            dataIndex: "timeSeries",
            key: "timeSeries",
            width: 120,
          },
        ]
      : []),

    {
      title: "Mã người quản lý",
      dataIndex: "code",
      key: "code",
      width: 120,
    },
    {
      title: "Người quản lý",
      dataIndex: "fullName",
      key: "fullName",
      width: 200,
    },
    {
      title: "Doanh số",
      dataIndex: "billTotalPrice",
      key: "billTotalPrice",
      width: 200,
      render(value) {
        return formatter(value);
      },
    },
    {
      title: "Số lượng đơn hàng",
      dataIndex: "count",
      key: "count",
      width: 120,
      render(value) {
        return formatter(value);
      },
    },
    {
        title: "Công nợ",
        dataIndex: "debt",
        key: "debt",
        width: 200,
        render(value) {
          return formatter(value);
        },
      },
  ];
  return (
    <div style={{ marginTop: 20 }}>
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
    </div>
  );
}
