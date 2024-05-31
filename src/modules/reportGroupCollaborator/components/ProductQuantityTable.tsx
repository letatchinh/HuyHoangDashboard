import { ColumnsType } from "antd/es/table";
import React from "react";
import { formatter } from "~/utils/helpers";
import TableAnt from "~/components/Antd/TableAnt";
import { v4 } from "uuid";
import moment from "moment";
import WhiteBox from "~/components/common/WhiteBox";
import { useGetReportGroupCollaboratorsBill } from "../reportGroupCollaborator.hook";
type propsType = {
  query?: any;
  pagination?: any;
};
export default function ProductQuantityTable(
  props: propsType
): React.JSX.Element {
  const { query, pagination } = props;
  const [data, isLoading] = useGetReportGroupCollaboratorsBill(query);
  const columns: ColumnsType = [
    ...(query?.getByRanger === true
    ? [
        {
          title: "Chu kì",
          dataIndex: "timeseries",
          key: "timeseries",
          width: 120,
        },
      ]
    : []),
    {
      title: "Người quản lý",
      dataIndex: "fullName",
      key: "fullName",
      // width: 280,
    },
    {
      title: "Nhóm sản phẩm",
      dataIndex: "productGroupName",
      key: "productGroupName",
      // width: 120,
    },
    {
      title: "Mã thuốc",
      dataIndex: "productCode",
      key: "productCode",
      // width: 120,
    },
    {
      title: "Tên thuốc",
      dataIndex: "productName",
      key: "productName",
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
      dataIndex: "total",
      key: "total",
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
