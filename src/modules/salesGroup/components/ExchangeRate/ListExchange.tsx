import { Button, Divider, Form, List, Skeleton, FormInstance, Row } from "antd";
import React, { useEffect, useState } from "react";
import SelectExchange from "./SelectExchange";
import { PlusOutlined } from "@ant-design/icons";
import useSalesGroupStore from "../../salesGroupContext";
import { get, omit } from "lodash";
import { useFetchState } from "~/utils/helpers";
import apis from "~/modules/supplier/supplier.api";

type propsType = {};

export interface DataType {
  key: React.Key;
  supplierAId: string;
  exchangeRateA: number;
  exchangeRateB: number;
  supplierBId: string;
}
export default function ListExchange(props: propsType): React.JSX.Element {
  const {
    id,
    onCloseFormExchangeRate,
    updateSalesGroup,
    parentNear,
    groupInfo,
  } = useSalesGroupStore();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [form] = Form.useForm();
  const [count, setCount] = useState(0);

  const [suppliers, isLoading] = useFetchState({
    api: apis.getAllPublic,
    useDocs: false,
  });

  //Fetch

  useEffect(() => {
    const mapData = (data: any[]) => {
      const res = data?.map((item: any, index: number) => ({
        key: index,
        exchangeRateA: item?.exchangeRateA,
        exchangeRateB: item?.exchangeRateB,
        supplierAId: item?.supplierAId,
        supplierBId: item?.supplierBId,
      }));
      setCount(res?.length);
      return res;
    };
    if (groupInfo?.exchangeRateOverride) {
      return setDataSource(mapData(groupInfo?.exchangeRateOverride));
    } else if (parentNear) {
      return setDataSource(parentNear?.exchangeRateOverride);
    } else {
      return setDataSource([]);
    }
  }, [groupInfo]);

  //Handle

  const handleAdd = () => {
    const data = suppliers?.map((item: any) => ({
      label: get(item, "name"),
      value: get(item, "_id"),
      disabled: false,
    }));
    const defaultData: any = {
      supplierAId: data[0]?.value,
      supplierBId: data[1]?.value,
      exchangeRateA: 1,
      exchangeRateB: 1,
    };
    setDataSource([...dataSource, defaultData]);
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
  const onSubmit = () => {
    try {
      const newDataSource = dataSource?.map((item: any) => ({
        ...omit(item, "key"),
      }));
      const data = {
        exchangeRateOverride: [...newDataSource],
        _id: id,
      };
      updateSalesGroup(data);
      onCloseFormExchangeRate();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div style={{ width: "100%", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Button icon={<PlusOutlined />} onClick={() => handleAdd()}>
          {" "}
          Thêm hàng
        </Button>
      </div>
      <List
        dataSource={dataSource}
        renderItem={(item: any, index: any) => {
          return (
            <List.Item key={item.key}>
              <SelectExchange
                index={index}
                value={item}
                handleDelete={handleDelete}
                onSave={handleSave}
                form={form}
                setDataSource={setDataSource}
                dataSource={dataSource}
                suppliers={suppliers}
              />
            </List.Item>
          );
        }}
      />
      <Row gutter={10} justify={"end"}>
        <Button style={{ marginRight: 10 }} onClick={onCloseFormExchangeRate}>
          Huỷ
        </Button>
        <Button type="primary" onClick={onSubmit}>
          Cập nhật
        </Button>
      </Row>
    </div>
  );
}
