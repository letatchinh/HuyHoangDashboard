import React from 'react';

import { Tag } from 'antd';
import { get } from 'lodash';

import { MAP_STATUS_VOUCHERS_VI,  WH_VOUCHER_STATUS, STATUS_VOUCHERS_VI} from '~/constants/defaultValue';

const StatusTag = ({ status }: any) => {
  console.log(status,'status')
  return (
    <Tag color={get(MAP_STATUS_VOUCHERS_VI[status || WH_VOUCHER_STATUS.CREATED], "color")}>
      {get(MAP_STATUS_VOUCHERS_VI[status || WH_VOUCHER_STATUS.CREATED], "name")}
    </Tag>
  )
};

export default StatusTag;
