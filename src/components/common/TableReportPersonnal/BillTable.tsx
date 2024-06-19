import { ColumnsType } from "antd/es/table";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import TableAnt from "~/components/Antd/TableAnt";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { formatter } from "~/utils/helpers";
import WhiteBox from "../WhiteBox";
import { v4 } from "uuid";
type propsType = {
  query?: any;
  data?: any;
  pagination?: any;
  isLoading?: boolean;
};
export default function BillTable(props: propsType): React.JSX.Element {
  const { query, data, pagination, isLoading } = props;
  const canReadBill = useMatchPolicy(POLICIES.READ_BILL);

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
      title: "Mã người thực hiện",
      dataIndex: "sellerCode",
      key: "sellerCode",
      width: 120,
    },
    {
      title: "Tên người thực hiện",
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
      title: "Số lượng đơn hàng",
      dataIndex: "quantity",
      key: "quantity",
      width: 120,
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
          rowKey={(rc) => rc?._id+v4()}
          columns={columns}
          size="small"
          pagination={pagination}
          stickyTop
        />
      </WhiteBox>
    </div>
  );
}
