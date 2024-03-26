import { Button, Typography } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React from "react";
import { formatter } from "~/utils/helpers";
import { STATUS_REPORT_EMPLOYEE } from "../../constants";
import useDetailReportStore from "../../DetailReportContext";
import { TargetsSupplierItem } from "../../reportEmployee.modal";
import TableTargetsTemplate from "./TableTargetsTemplate";
type propsType = {
  dataSource: TargetsSupplierItem[];
};
export default function TableTargetsSelf({
  dataSource,
}: propsType): React.JSX.Element {
  const { onOpenSwap, data , loading } = useDetailReportStore();
  const columns: ColumnsType = [
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      render: (supplier: any) => get(supplier, "name", ""),
    },
    {
      title: "Doanh số tối thiểu",
      dataIndex: "minSale",
      key: "minSale",
      align: "center",
      render: (minSale: any) => formatter(minSale || 0),
    },
    {
      title: "Doanh số khoán",
      dataIndex: "mineralSale",
      key: "mineralSale",
      align: "center",
      render: (mineralSale: any) => formatter(mineralSale || 0),
    },
    {
      title: "Doanh số thực tế hoàn thành",
      dataIndex: "actuallySale",
      key: "actuallySale",
      align: "center",
      render: (actuallySale: any, rc: any) => (
        <span
          style={{ color: actuallySale < get(rc, "minSale") ? "red" : "unset" }}
        >
          {formatter(actuallySale || 0)}
        </span>
      ),
    },
    {
      title: "Áp dụng quy đổi",
      dataIndex: "afterExchangeSale",
      key: "afterExchangeSale",
      align: "center",
      render: (afterExchangeSale: any, rc: any) => (
        <Typography.Text strong
          style={{
            color: afterExchangeSale < get(rc, "minSale") ? "red" : "unset",
          }}
        >
          {formatter(afterExchangeSale || 0)}
        </Typography.Text>
      ),
    },
  ];
  if (get(data, "status") === STATUS_REPORT_EMPLOYEE.NEW) {
    columns.push({
      title: "Thao tác",
      key: "_id",
      align: "center",
      render: (_id: any, rc: any) => (
        <Button
          onClick={() =>
            onOpenSwap({
              ...(get(rc, "saleCanChange", 0) > 0 && {
                resourceSupplierId: get(rc, "supplier._id"),
              }),
              ...(get(rc, "saleCanChange", 0) <= 0 && {
                targetSupplierId: get(rc, "supplier._id"),
              }),
              type: "self",
            })
          }
          type="primary"
        >
          Quy đổi
        </Button>
      ),
    });
  }
  return (
    <TableTargetsTemplate
      dataSource={dataSource}
      columns={columns}
      loading={loading}
      titleHeader="Chỉ tiêu cá nhân"
    />
  );
}
