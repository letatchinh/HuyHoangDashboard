import React, { useMemo } from "react";
import { Select, Space } from "antd";
import { get } from "lodash";

interface StatusItem {
  _id: string;
  value: string;
  backgroundColor: string;
  color: string;
  name: string;
  justAdmin: boolean;
};

interface SelectStatusTaskProps {
  handleChange: (value: string) => void;
  defaultValue: string;
  value: string;
  listStatus: StatusItem[];
  initStatusValue?: StatusItem | object;
};

interface CSSProperties {
  "--select-by-status-bg"?: string;
  "--select-by-status-color"?: string;
};

function SelectStatusTask({
  handleChange,
  defaultValue,
  value,
  listStatus,
  initStatusValue = {},
}: SelectStatusTaskProps) {

  const listStatusMap = useMemo(() => {
    return listStatus?.reduce((result: any, item) => {
      result[item._id] = {
        value: item?.value,
        backgroundColor: item.backgroundColor,
        color: item.color,
        name: item.value,
        justAdmin: item.justAdmin,
      };
      return result;
    }, {});
  }, [listStatus]);

  const styleListStatus = useMemo(
    () => ({
      ...{ [get(initStatusValue, "value", "không xác định")]: initStatusValue },
      ...listStatusMap,
    }),
    [initStatusValue, listStatusMap]
  );

  if (!listStatus?.length) return null;

  const customStyles: CSSProperties = {
    "--select-by-status-bg": styleListStatus?.[value]?.backgroundColor,
    "--select-by-status-color": styleListStatus?.[value]?.color,
  };
  return (
    <Select
      className="selectTask-custom"
      style={{
        width: "150px",
        textAlign: "center",
        ...customStyles,
        borderRadius: "9px",
      }}
      defaultValue={defaultValue}
      onSelect={handleChange}
      placement={"bottomLeft"}
      value={value}
    >
      {Object.keys(listStatusMap).map((status) => (
        <Select.Option
          label={listStatusMap?.[status]?.value}
          key={status}
          value={status}
          style={{ width: "fill", cursor: "pointer" }}
        >
          <Space style={{ width: "max-content" }}>
            <Space>
              <div
                className="select_option_circle"
                style={{
                  backgroundColor: listStatusMap?.[status]?.backgroundColor,
                }}
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
