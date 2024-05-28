import { ColumnsType } from "antd/es/table";
import React from "react";
import { formatter } from "~/utils/helpers";
import WhiteBox from "../WhiteBox";
import TableAnt from "~/components/Antd/TableAnt";
import { v4 } from "uuid";
import moment from "moment";
type propsType = {
  query?: any;
  data?: any;
  pagination?: any;
  isLoading?: boolean;
};
export default function ProductQuantityTable(
  props: propsType
): React.JSX.Element {
  const { query, data, pagination, isLoading } = props;
  const columns: ColumnsType = [
    ...(query?.datatype?.includes("reportRangerType")
    ? [
        {
          title: "Chu kì",
          dataIndex: "timeSeries",
          key: "timeSeries",
          width: 120,
          render: (record: any) => {
            return moment(record).format("DD/MM/YYYY");
          },
        },
      ]
    : []),
    {
      title: "Người đảm nhiệm",
      dataIndex: "seller",
      key: "seller",
      // width: 280,
    },
    {
      title: "Mã thuốc",
      dataIndex: "code",
      key: "code",
      // width: 120,
    },
    {
      title: "Tên thuốc",
      dataIndex: "name",
      key: "name",
      width: 280,
    },
    {
      title: "Số lượng",
      dataIndex: "quantity",
      key: "quantity",
      width: 150,
      // align: "center" as any,
       render(variants, record, index) {
        return (
          <div>
            {record?.quantity + " (" + record?.variant + ")"}
          </div>
        );
      },
    },
    {
      title: "Thành tiền",
      dataIndex: "totalReport",
      key: "totalReport",
      // width: 180,
      render(record) {
        return formatter(record);
      },
    },
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      // width: 250,
    },
  ];
  return (
    <WhiteBox>
      <TableAnt
        dataSource={data ?? []}
        loading={isLoading}
        rowKey={(rc) => [rc?._id,v4()].join('.')}
        columns={columns}
        size="small"
        pagination={pagination}
        stickyTop
      />
    </WhiteBox>
  );
}
