import { Button, Divider, Form, List, Skeleton,FormInstance } from "antd";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import SelectExchange from "./SelectExchange";
import { PlusOutlined } from "@ant-design/icons";

type propsType = {};
const dataDefault = [
  {
    supplierAId: '65f65e9c81913f41f18db1f1',
    exchangeRateA: 1,
    exchangeRateB: 2,
    supplierBId: '65f560a04e7e84b81e6de9ab',
    id: '1'
  },
  {
    supplierAId: '65f65e9c81913f41f18db1f1',
    exchangeRateA: 1,
    exchangeRateB: 2,
    supplierBId: '65f560a04e7e84b81e6de9ab',
    id: '2'
  },
]
interface DataType {
  key: React.Key;
  supplierAId: string;
  exchangeRateA: number;
  exchangeRateB: number;
  supplierBId: string;
  _id: string;
};
export default function ListExchange(props: propsType): React.JSX.Element {
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [form] = Form.useForm();

  const [count, setCount] = useState(0);

  //Handle 

  const save = async () => {
    try {
      const values = await form?.validateFields();
      console.log(values,'values')
      // handleSave({ ...record, ...values });
    } catch (errInfo) {
      console.log('Save failed:', errInfo);
    }
  };

  const handleAdd = () => {
    const newData: DataType = {
      key: count,
      supplierAId: '',
      exchangeRateA: 1,
      exchangeRateB: 1,
      supplierBId: '',
      _id: ''
    };
    setDataSource([...dataSource, newData]);
    setCount(count + 1);
  };
  const handleDelete = (key: any) => {
    const newData = dataSource.filter((item) => item.key !== key);
    setDataSource(newData);
  };

  const handleSave = (row: DataType) => {
    const newData = [...dataSource];
    const index = newData.findIndex((item) => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row,
    });
    setDataSource(newData);
  };

  useEffect(() => {
    if (!dataSource?.length ){ 
      handleAdd();
    };
  }, [dataSource]);

  return (
    <div style={{width : '100%', padding : 20}}>
      <div
        style={{display : 'flex',justifyContent : 'flex-end'}}
      >
        <Button
          icon={<PlusOutlined />}
          onClick={() => handleAdd()}
        > Thêm hàng</Button>
      </div>
      <List
        dataSource={dataSource}
        renderItem={(item: any, index: any) => {
          return(
          <List.Item key={item.key}>
            <SelectExchange 
              index={index} 
              value={item}
              handleDelete={handleDelete}
                save={save}
                form={form}
            />
          </List.Item>
        )}}
      />
    </div>
  );
}
