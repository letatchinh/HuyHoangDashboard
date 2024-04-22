import { Button, Divider, Form, List, Skeleton, FormInstance, Row, Tooltip, Modal } from "antd";
import React, { useEffect, useState } from "react";
import SelectExchange from "./SelectExchange";
import { PlusOutlined, WarningOutlined } from "@ant-design/icons";
import useSalesGroupStore from "../../salesGroupContext";
import { get, omit } from "lodash";
import { useFetchState } from "~/utils/helpers";
import apis from "~/modules/supplier/supplier.api";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import InfoParentExchange from "./InfoParentExchange";
import useNotificationStore from "~/store/NotificationContext";

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
    setParentNear,
    setGroupInfo,
    isSubmitLoading
  } = useSalesGroupStore();
  const [dataSource, setDataSource] = useState<DataType[]>([]);
  const [dataSourceParent, setDataSourceParent] = useState<DataType[]>([]);
  const [form] = Form.useForm();
  const [count, setCount] = useState(0);
  const { onNotify } = useNotificationStore();

  const [suppliers, isLoading] = useFetchState({
    api: apis.getAllPublic,
    useDocs: false,
  });
  const onClose = () => {
    Modal.destroyAll();
    setParentNear(null)
    setGroupInfo(null)
  };
  //Fetch
  

  useEffect(() => {
    const mapData = (data: any[]) => {
      if (!data?.length) {
        return [];
      };
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
    setDataSourceParent(mapData(parentNear?.exchangeRateOverride));
    setDataSource(mapData(groupInfo?.exchangeRateOverride));
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
      key: count,
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
      Object.assign(data, {
        callback: onClose
      })
      // onClose(data);
      updateSalesGroup(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onCopy = () => {
    try {
      const newData = [...dataSource, ...dataSourceParent];
      const newDataSource = newData?.map((item: any, index: any) => ({
        ...item,
        key: index,
      }));
      setCount(newDataSource?.length);
      setDataSource([...newDataSource]);
    } catch (error) {
      onNotify?.error("Sao chép thất bại, vui lòng thử lại!");
    }
  };

  return (
    <div style={{ width: "100%", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Tooltip title = 'Sao chép dữ liệu từ "Giá trị mặc định" sang "Giá trị thay đổi"'>
          <Button style={{ marginRight: 10 }} onClick={onCopy}>Sao chép</Button>
        </Tooltip>
        <Button icon={<PlusOutlined />} onClick={() => handleAdd()}>
          {" "}
          Thêm hàng
        </Button>
      </div>
      
      <BaseBorderBox title={<Tooltip title = 'Giá trị mặc định được lấy từ vùng quản lý trên, không được phép thay đổi'>Giá trị mặc định <WarningOutlined /></Tooltip>}>
        <List
          dataSource={dataSourceParent}
          renderItem={(item: any, index: any) => {
            return (
              <List.Item key={item.key}>
                <InfoParentExchange
                  index={index}
                  value={item}
                  suppliers={suppliers}
                />
              </List.Item>
            );
          }}
        />
      </BaseBorderBox>
      <BaseBorderBox title={'Giá trị thay đổi'}>
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
      </BaseBorderBox>
      <Row gutter={10} justify={"end"}>
        <Button
          style={{ marginRight: 10 }}
          onClick={onClose}
          loading =  { isSubmitLoading}
        >
          Huỷ
        </Button>
        <Button
          type="primary"
          onClick={onSubmit}
          loading =  { isSubmitLoading}
        >
          Cập nhật
        </Button>
      </Row>
    </div>
  );
}
