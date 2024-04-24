import { Tag } from 'antd';
import React from 'react';
import { PROCESS_STATUS_VI, PROCESS_STATUS_VI_COLOR } from '../pharmacy.modal';
type propsType = {
  processStatus: string
}
export default function StatusProcess({processStatus}:propsType) : React.JSX.Element {
  return (
    <Tag color = {PROCESS_STATUS_VI_COLOR[processStatus]}>
      {PROCESS_STATUS_VI[processStatus]}
    </Tag>
  )
}