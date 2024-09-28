import { Table } from "antd";
import type { TableProps } from "antd/es/table";
import React from "react";
interface ExtendTableProps extends TableProps<any> {
  stickyTop?: boolean;
}
export default function TableAnt({
  stickyTop,
  ...props
}: ExtendTableProps): React.JSX.Element {
  return (
    <Table
      {...(stickyTop && {
        // antd site header height
        sticky: {
          offsetHeader: -10, // 10 Is padding Top
        },
      })}
      size="small"
      {...props}
    />
  );
}
