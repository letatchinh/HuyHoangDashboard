import React from 'react';

import { Tag } from 'antd';
import { get } from 'lodash';
import { STATUS_LINK_WAREHOUSE_VI } from '../constants';


const StatusTagWarehouse = ({ status }: any) => {
  return (
    <Tag color={get(STATUS_LINK_WAREHOUSE_VI[status], "color")}>
      {get(STATUS_LINK_WAREHOUSE_VI[status], "name")}
    </Tag>
  )
};

export default StatusTagWarehouse;
