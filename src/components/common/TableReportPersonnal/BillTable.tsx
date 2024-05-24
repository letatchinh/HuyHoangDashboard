import { ColumnsType } from "antd/es/table";
import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";
import TableAnt from "~/components/Antd/TableAnt";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { formatter } from "~/utils/helpers";
import WhiteBox from "../WhiteBox";
type propsType = {
  data?: any;
  pagination?: any;
  isLoading?: boolean;
};
export default function BillTable(props: propsType): React.JSX.Element {
  const { data, pagination, isLoading } = props;
  const canReadBill = useMatchPolicy(POLICIES.READ_BILL);

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
        render: (record) => {
          return moment(record).format("DD/MM/YYYY");
        },
      },
    {
      title: "Mã người thực hiện",
      dataIndex: "codeSequence",
      key: "codeSequence",
      width: 120,
      render(codeSequence) {
        return canReadBill ? (
          <Link
            className="link_"
            to={`/bill?keyword=${codeSequence}`}
            target={"_blank"}
          >
            {codeSequence}
          </Link>
        ) : (
          codeSequence
        );
      },
    },
    {
        title: "Tên người thực hiện",
        dataIndex: "totalPrice",
        key: "totalPrice",
        width: 200,
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
      title: "Số lượng đơn hàng",
      dataIndex: "pair",
      key: "pair",
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
  );
}
