import { DeleteOutlined } from "@ant-design/icons";
import { Flex, Form, InputNumber, Select, Space } from "antd";
import { get } from "lodash";
import React, {  useEffect, useMemo, useState } from "react";
import {
  filterOptionSlug,
} from "~/utils/helpers";
import { DataType } from "./ListExchange";
type propsType = {
  value?: any;
  index?: any;
  key?: any;
  onSelect?: (value: any) => void;
  handleDelete?: (value: any) => void;
  form?: any;
  onSave?: any;
  dataSource?: any;
  setDataSource?: any;
  suppliers?: any;
  isLoading?: boolean;
};
export default function SelectExchange({
  onSelect,
  index,
  value,
  handleDelete,
  key,
  form,
  onSave,
  dataSource,
  setDataSource,
  suppliers,
  isLoading,
}: propsType): React.JSX.Element {
  const [options, setOptions] = useState<any[]>([]);

  useEffect(() => {
    if (suppliers?.length) {
      const data = suppliers?.map((item: any) => ({
        label: get(item, "name"),
        value: get(item, "_id"),
        disabled: false,
      }));
      setOptions(data);
    };
  }, [suppliers]);

  const onCheckSelect = (dataIndex: any) => {
    const newOptions = [...options];
    const mapOptions: any[] = newOptions?.map((item: any) => {
      const valueForm = value?.[dataIndex];
      if (item?.value === valueForm) {
        return {
          ...item,
          disabled: true,
        };
      } else {
        return {
          ...item,
          disabled: false,
        };
      }
    });
    setOptions(mapOptions);
  };

  const handleSave = (e: any) => {
    const record = form.getFieldsValue();
    const item: DataType = {
      ...record,
      key: value?.key,
      ...e,
    };
    onSave(item);
  };
  return (
    <Flex gap={12} vertical>
      <Flex gap={8}>
        <Space>Từ: </Space>
        <Select
          placeholder="Vui lòng chọn nhà cung cấp"
          style={{ flex: 1, width: "320px",maxWidth: '320px',  minWidth: '320px'  }}
          onSelect={(e: any) => handleSave({ supplierAId: e })}
          onClick={() => onCheckSelect("supplierBId")}
          showSearch
          filterOption={filterOptionSlug}
          loading={isLoading}
          options={options}
          value={dataSource[index]?.supplierAId}
        />

        <Space>Sang: </Space>
        <Select
          placeholder="Vui lòng chọn nhà cung cấp"
          style={{ flex: 1, width: "320px", maxWidth: '320px',  minWidth: '320px' }}
          onSelect={(e: any) => handleSave({ supplierBId: e })}
          onClick={() => onCheckSelect("supplierAId")}
          showSearch
          filterOption={filterOptionSlug}
          options={options}
          value={dataSource[index]?.supplierBId}
          loading={isLoading}
        />
        <Space>Tỉ lệ quy đổi: </Space>
        <InputNumber
          type="number"
          value={dataSource[index]?.exchangeRateA}
          min={1}
          onPressEnter={(e: any) =>
            handleSave({ exchangeRateA: +e.target.value })
          }
          onBlur={(e: any) => handleSave({ exchangeRateA: +e.target.value })}
        />
        <Space>/</Space>
        <InputNumber
          type="number"
          value={dataSource[index]?.exchangeRateB}
          min={1}
          onPressEnter={(e: any) =>
            handleSave({ exchangeRateB: +e.target.value })
          }
          onBlur={(e: any) => handleSave({ exchangeRateB: +e.target.value })}
        />
        {handleDelete && (
          <div style={{ cursor: "pointer" }}>
            <DeleteOutlined
              style={{ color: "red" }}
              onClick={() => handleDelete && handleDelete(value?.key)}
            />
          </div>
        )}
      </Flex>
    </Flex>
  );
}
