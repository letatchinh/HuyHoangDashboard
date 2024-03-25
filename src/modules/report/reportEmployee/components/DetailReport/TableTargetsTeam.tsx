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
export default function TableTargetsTeam({
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
      title: "Chỉ tiêu nhóm",
      dataIndex: "targetTeam",
      key: "targetTeam",
      align : 'center',
      render: (targetTeam: any) => formatter(targetTeam || 0),
    },
    {
      title: "Doanh số thực tế hoàn thành",
      dataIndex: "actuallySale",
      key: "actuallySale",
      align : 'center',
      render: (actuallySale: any,rc:any) => <span style={{color : actuallySale < get(rc,'targetTeam') ? 'red' : 'unset'}}>{formatter(actuallySale || 0)}</span>
    },
    
  ];
  return (
    <TableTargetsTemplate
      dataSource={dataSource}
      columns={columns}
      titleHeader="Chỉ tiêu nhóm"
    />
  );
}
