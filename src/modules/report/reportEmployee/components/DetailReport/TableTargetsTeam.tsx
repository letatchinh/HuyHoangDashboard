import { Button } from "antd";
import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React from "react";
import { EMPLOYEE_LEVEL } from "~/modules/employee/constants";
import { formatter } from "~/utils/helpers";
import { STATUS_REPORT_EMPLOYEE } from "../../constants";
import useDetailReportStore from "../../DetailReportContext";
import { TargetsSupplierItem } from "../../reportEmployee.modal";
import TableTargetsTemplate from "./TableTargetsTemplate";
type propsType = {
  dataSource: TargetsSupplierItem[];
};
export default function TableTargetsTeam({
  dataSource,
}: propsType): React.JSX.Element {
  const { onOpenSwap, employeeLevel,data } = useDetailReportStore();
  const columns: ColumnsType = [
    {
      title: "Nhà cung cấp",
      dataIndex: "supplier",
      key: "supplier",
      render: (supplier: any) => get(supplier, "name", ""),
    },
    {
      title: "Chỉ tiêu nhóm",
      dataIndex: "targetTeam",
      key: "targetTeam",
      align: "center",
      render: (targetTeam: any) => formatter(targetTeam || 0),
    },
    {
      title: "Mức độ hoàn thành thực tế",
      dataIndex: "actuallySale",
      key: "actuallySale",
      align: "center",
      render: (actuallySale: any, rc: any) => (
        <span
          style={{
            color: actuallySale < get(rc, "targetTeam") ? "red" : "unset",
          }}
        >
          {formatter(actuallySale || 0)}
        </span>
      ),
    },
    {
      title: "Áp dụng quy đổi",
      dataIndex: "afterExchangeSale",
      key: "afterExchangeSale",
      render: (afterExchangeSale: any, rc: any) => (
        <span
          style={{
            color: afterExchangeSale < get(rc, "targetTeam") ? "red" : "unset",
          }}
        >
          {formatter(afterExchangeSale || 0)}
        </span>
      ),
    },
  ];
  if (employeeLevel === EMPLOYEE_LEVEL.ASM && get(data,'status') === STATUS_REPORT_EMPLOYEE.NEW) {
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
              type: "team",
            })
          }
          type="primary"
        >
          Quy đổi
        </Button>
      ),
    });
  }
  columns.push();
  return (
    <TableTargetsTemplate
      dataSource={dataSource}
      columns={columns}
      titleHeader="Chỉ tiêu nhóm"
    />
  );
}
