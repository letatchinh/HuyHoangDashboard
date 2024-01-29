import React from 'react';

import { Tag } from 'antd';
import { get } from 'lodash';

import { ORDER_STATUS, ORDER_STATUS_KEY_SEARCH_COLOR} from '~/constants/defaultValue';

const StatusTag = ({ status}: any) => {
  return (
    <Tag color={get(ORDER_STATUS_KEY_SEARCH_COLOR[status], "color")}>
      {get(ORDER_STATUS_KEY_SEARCH_COLOR[status], "name")}
    </Tag>
  )
};

export default StatusTag;
