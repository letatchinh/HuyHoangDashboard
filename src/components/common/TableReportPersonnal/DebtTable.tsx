import { ColumnsType } from "antd/es/table";
import React from "react";
import { formatter } from "~/utils/helpers";
import WhiteBox from "../WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import moment from "moment";
import { Link } from "react-router-dom";
import { v4 } from "uuid";
type propsType = {
  data?: any;
  pagination?: any;
  isLoading?: boolean;
};
export default function DebtTable(props: propsType): React.JSX.Element {
  const { data, pagination, isLoading } = props;
  const columns: ColumnsType = [
    {
      title: "Chu kì",
      dataIndex: "timeSeries",
      key: "timeSeries",
      width: 120,
      render: (record) => {
        return moment(record).format("DD/MM/YYYY");
      },
    },
    {
      title: "Mã người đảm nhiệm",
      dataIndex: "sellerCode",
      key: "sellerCode",
      width: 120,
    },
    {
        title: "Tên người đảm nhiệm",
        dataIndex: "seller",
        key: "seller",
        width: 200,
      },
    {
      title: "Giá trị đơn hàng",
      dataIndex: "totalReport",
      key: "totalReport",
      width: 200,
      render(value) {
        return formatter(value);
      },
    },
    {
      title: "Công nợ",
      dataIndex: "debt",
      key: "debt",
      width: 120,
      render(value) {
        return formatter(value) || 0;
      },
    },
  ];
  return (
    <WhiteBox>
      <TableAnt
        dataSource={data || []}
        loading={isLoading}
        rowKey={(rc) => rc?._id+v4()}
        columns={columns}
        size="small"
        pagination={pagination}
        stickyTop
      />
    </WhiteBox>
  );
}
