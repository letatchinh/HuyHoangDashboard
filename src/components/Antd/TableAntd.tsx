import { Table } from "antd";
import type { TableProps } from "antd/es/table";
import React from "react";
export default function TableAnt(props: TableProps<any>): React.JSX.Element {
  return <Table {...props} />;
}
