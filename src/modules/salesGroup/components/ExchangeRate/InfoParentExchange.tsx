import { DeleteOutlined } from "@ant-design/icons";
import { Flex, Form, Input, InputNumber, Select, Space, Spin } from "antd";
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
  isLoading?: boolean;
  suppliers?: any;
};
export default function InfoParentExchange({
  index,
  value,
  key,
  isLoading,
  suppliers,
}: propsType): React.JSX.Element {
  const [options, setOptions] = useState<any[]>([]);
  const findNameSupplier = (idSupplier: any) => {
    const res = suppliers?.find((item: any) => item?._id === idSupplier)?.name;
    return res;
  };
  const render = (component: any) => (
    isLoading ? <Spin /> : component
  );
  return (
    <Flex gap={12} vertical>
      <Flex gap={8}>
        <Space>Từ: </Space>
        {render(<Input
          style={{ width: "330px" }}
          value={findNameSupplier(value?.supplierAId)}
          readOnly
        />)}
        <Space>Sang: </Space>
        {render(<Input
          style={{ width: "330px" }}
          value={findNameSupplier(value?.supplierBId)}
          readOnly
        />)}
        <Space>Tỉ lệ quy đổi: </Space>
        {render(<InputNumber
          readOnly
          value={value?.exchangeRateA}
        />)}
        <Space>/</Space>
        {render(<InputNumber
          readOnly
          value={value?.exchangeRateB}
        />)}
      </Flex>
    </Flex>
  );
}
