import { DeleteOutlined } from "@ant-design/icons";
import { Flex, Form, InputNumber, Select, Space } from "antd";
import { get } from "lodash";
import React, { useEffect, useMemo, useState } from "react";
import SelectSupplier from "~/modules/supplier/components/SelectSupplier";
import apis from "~/modules/supplier/supplier.api";
import { useFetchState } from '~/utils/helpers';
type propsType = {
  value?: any;
  index?: number;
  key?: any;
  onSelect?: (value: any) => void;
  handleDelete?: (value: any) => void;
  save?: (value: any) => void;
  form?: any;
};
export default function SelectExchange({onSelect, index, value, handleDelete,key,save,form}: propsType): React.JSX.Element {
  const [suppliers, isLoading] = useFetchState({ api: apis.getAllPublic, useDocs: false });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (suppliers?.length) {
      const data = suppliers?.map((item: any) => ({
        label: get(item, 'name'),
        value: get(item, '_id')
      }));
      setOptions(data);
    };
  }, [suppliers]);

  return (
    <Form>
      <Flex gap={12} vertical>
        <Flex gap={8}>
          <Form.Item name="supplierAId" label = {'Từ'}>
            <Select
              options={options}
              placeholder="Vui lòng chọn nhà cung cấp"
              style={{ flex: 1, width: '350px' }}
              onSelect={save}
            />
          </Form.Item>
          <Form.Item name="supplierBId" label= {'Sang'}>
            <Select
              options={options}
              placeholder="Vui lòng chọn nhà cung cấp"
              style={{ flex: 1, width: '350px' }}
              onSelect={save}
            />
          </Form.Item>
          
          <Form.Item name={'exchangeRateA'} label= {'Tỉ lệ quy đổi'}>
            <InputNumber defaultValue={1} min={1} onPressEnter={save}/>
          </Form.Item>
          <Form.Item name={'exchangeRateB'}>
          <InputNumber defaultValue={1} min={1}  onPressEnter={save}/>
          </Form.Item>
        {handleDelete && <Form.Item name={'delete'}>
          <DeleteOutlined style={{color : 'red'}} onClick={() => handleDelete && handleDelete(value?.key)}/>
          </Form.Item>}
          </Flex>
      </Flex>
    </Form>
  );
}
