import { ConfigProvider, Table } from "antd";
import { ColumnProps } from "antd/es/table";
import React from "react";
import TableAnt from "~/components/Antd/TableAnt";
type propsType = {};


const columns :ColumnProps<any>[]= [
    {
        title:'Tên',
        key:'name',
        dataIndex:'fullName'
    }
]

export default function BuyGroup(props: propsType): React.JSX.Element {
    
  return (
    <div className="buy_group" style={{ height: "200vh" }}>
      <ConfigProvider
        theme={{
          components: {
            Table: {
              /* here is your component tokens */
            },
          },
        }}
      >
        <TableAnt stickyTop sticky={{offsetHeader:0}} columns={columns}/>
      </ConfigProvider>
    </div>
  );
}
