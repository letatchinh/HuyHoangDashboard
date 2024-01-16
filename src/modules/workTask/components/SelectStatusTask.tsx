import { Select, Space } from 'antd';
import { get } from 'lodash';
import React, { useMemo } from 'react';
// import { TASK_ITEM_STATUS_NAME } from '~/constants/defaultValue';

interface SelectStatusTaskProps {
  handleChange: (value: string) => void;
  defaultValue: string;
  value: string;
  listStatus: any[]; // Replace 'any' with the actual type of your 'listStatus' array
  initStatusValue: any; // Replace 'any' with the actual type of your 'initStatusValue' object
}

const SelectStatusTask: React.FC<SelectStatusTaskProps> = ({ handleChange, defaultValue, value, listStatus, initStatusValue }) => {

  const listStatusMap = useMemo(() => {
    return listStatus?.reduce((result, item) => {
      result[item._id] = {
        value: item?.value,
        backgroundColor: item.backgroundColor,
        color: item.color,
        name: item.value,
        justAdmin: item.justAdmin
      };
      return result;
    }, {})
  }, [listStatus]);

  const styleListStatus = useMemo(() => ({
    ...{ [get(initStatusValue, 'value', 'không xác định')]: initStatusValue },
    ...listStatusMap
  }), [initStatusValue, listStatusMap]);

  if (!listStatus?.length) return null;
  const customStyle = {
    width: 'max-content',
    '--select-by-status-bg': styleListStatus?.[value]?.backgroundColor,
    '--select-by-status-color': styleListStatus?.[value]?.color,
    borderRadius: '9px'
  };
  return (
    <Select
      className="selectTask-custom"
      style={customStyle}
      defaultValue={defaultValue}
      onSelect={handleChange}
      placement={'bottomLeft'}
      value={value}
    >
      {Object.keys(listStatusMap).map((status) => (
        <Select.Option
          label={listStatusMap?.[status]?.value}
          key={status}
          value={status}
          style={{ width: 'fill-content' }}
        >
          <Space style={{ width: '100%' }}>
            <Space>
              <div
                className="select_option_circle"
                style={{ backgroundColor: listStatusMap?.[status]?.backgroundColor }}
              ></div>
            </Space>
            <Space style={{ flexGrow: 1 }}>
              {listStatusMap?.[status]?.name || value}
            </Space>
          </Space>
        </Select.Option>
      ))}
    </Select>
  );
}

export default SelectStatusTask;
