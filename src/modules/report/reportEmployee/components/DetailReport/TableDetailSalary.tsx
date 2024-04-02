import { ColumnsType } from "antd/es/table/InternalTable";
import { get } from "lodash";
import React from "react";
import TableAnt from "~/components/Antd/TableAnt";
import { formatter } from "~/utils/helpers";
import useDetailReportStore from "../../DetailReportContext";
import { ItemDataSource } from "../../reportEmployee.service";
import { Flex } from "antd";
type propsType = {
    dataSource : ItemDataSource[]
};
export default function TableDetailSalary({dataSource}: propsType): React.JSX.Element {
  const {loading} = useDetailReportStore();
    const columns: ColumnsType = [
        {
          title: "Tiêu chí",
          dataIndex: "title",
          key: "title",
          render : (title,rc) => {
            const AfterTitle : any = get(rc,'afterTitle');
            const BeforeTitle : any = get(rc,'beforeTitle');
            
            return <Flex align="center"><span style={get(rc,'styleTitle',{})}>{BeforeTitle && BeforeTitle}{title} {AfterTitle && AfterTitle}</span></Flex>
          }
        },
        {
          title: "Thành tiền",
          dataIndex: "value",
          key: "value",
          align : 'center',
          render: (value: number,rc) => {
            if(value === undefined){ // set undefined To prevent Show String at Title
                return ""
            }else{
                return value ? <span style={get(rc,'styleTitle',{})}>{formatter(value)}</span> : "-"
            }
          }
        },
      ];
  return (
    <TableAnt
      title={() => (
        <div className="headerTableTargets">
          <span>{"Chi tiết lương"}</span>
        </div>
      )}
      bordered
      rowKey={({key}) => key}
      columns={columns}
      loading={loading}
      dataSource={dataSource}
      pagination={false}
      size="small"
      // expandable={{
        // expandRowByClick : true
      // }}
    />
  );
}
