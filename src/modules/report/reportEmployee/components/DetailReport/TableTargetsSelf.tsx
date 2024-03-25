import { Button } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React from "react";
import { formatter } from "~/utils/helpers";
import useDetailReportStore from "../../DetailReportContext";
import { TargetsSupplierItem } from "../../reportEmployee.modal";
import TableTargetsTemplate from "./TableTargetsTemplate";
type propsType = {
  dataSource: TargetsSupplierItem[];
};
export default function TableTargetsSelf({
  dataSource,
}: propsType): React.JSX.Element {
  const {onOpenSwap} = useDetailReportStore();
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
      render: (minSale: any) => formatter(minSale || 0),
    },
    {
      title: "Doanh số khoán",
      dataIndex: "mineralSale",
      key: "mineralSale",
      render: (mineralSale: any) => formatter(mineralSale || 0),
    },
    {
      title: "Doanh số thực tế hoàn thành",
      dataIndex: "actuallySale",
      key: "actuallySale",
      render: (actuallySale: any, rc: any) => (
        <span
          style={{ color: actuallySale < get(rc, "minSale") ? "red" : "unset" }}
        >
          {formatter(actuallySale || 0)}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "_id",
      align: "center",
      render: (_id: any, rc: any) => (
        <Button
          onClick={() =>
            onOpenSwap({
              ...get(rc,'saleCanChange',0) > 0 && {resourceSupplierId: get(rc, "supplier._id")},
              ...get(rc,'saleCanChange',0) <= 0 && {targetSupplierId: get(rc, "supplier._id")},
              type: "self",
            })
          }
          type="text"
        >
          Quy đổi
        </Button>
      ),
    },
  ];
  return (
    <TableTargetsTemplate
      dataSource={dataSource}
      columns={columns}
      titleHeader="Chỉ tiêu cá nhân"
    />
  );
}
