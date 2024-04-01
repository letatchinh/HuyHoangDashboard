import { Divider, TableProps } from 'antd';
import React from 'react';
import TableAnt from '~/components/Antd/TableAnt';
interface ExtendTableProps extends TableProps<any> {
    stickyTop?: boolean;
    titleHeader?: string;
  }
export default function TableTargetsTemplate({titleHeader,...props}:ExtendTableProps) : React.JSX.Element {
    return (
        <TableAnt
      title={() => (
        <div className="headerTableTargets">
          <span>{titleHeader}</span>
        </div>
      )}
      bordered
      footer={() => <Divider/>}
      pagination={false}
      size='small'
      {...props}
    />
    )
}