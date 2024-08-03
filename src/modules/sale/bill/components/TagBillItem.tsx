import { Tag } from 'antd';
import React from 'react';
type propsType = {
  status: boolean
};
export default function TagBillItem({ status }: propsType): React.JSX.Element {
  return (
    <Tag color= {status ? 'green' : 'red'}>{status ? 'Sẵn sàng' : 'Chưa sẵn sàng'}</Tag>
  )
};