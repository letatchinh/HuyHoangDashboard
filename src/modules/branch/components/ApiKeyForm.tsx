import React, { useMemo } from "react";
import { Button, Form, Input, Row, Select } from "antd";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import TableAnt from "~/components/Antd/TableAnt";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useGetBranch, useGetListWarehouseInPMS } from "../branch.hook";
import { filterAcrossAccents, filterSelectWithLabel } from "~/utils/helpers";
import StatusTagWarehouse from "./StatsusTagWarehouse";
type propsType = {
  updateApiKey?: any;
  id: string | null | undefined;
};
type WarehouseItemType = {
  _id: string;
  name: string;
  createdAt: string;
  apiKey: string;
};
export default function ApiKeyForm({updateApiKey, id}: propsType): React.JSX.Element {
  const [newApiKey, setNewApiKey] = React.useState<string>("");
  const [branch, loading] = useGetBranch(id);
  // const [listWarehouse, loadingWarehouse] = useGetListWarehouseInPMS();
  const [form] = Form.useForm();

  // const optionsWarehouse = useMemo(() => listWarehouse?.map((item: any)=> ({value: item?._id, label: item?.name})), []);
  const onFinish = (values: any) => {
    console.log(values)
    // updateApiKey({ ...values, id });
  };

  const onValuesChange = (value: string) => {
  };

  const columns: ColumnsType = useMemo(() => [
    {
      title : "Tên kho",
      dataIndex : "warehouse",
      key: "warehouse",
      render: (warehouse) => <span>{warehouse?.name}</span>,
    },
    {
      title : "Ngày liên kết",
      dataIndex : "createdAt",
      key: "createdAt",
      render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title : "Trạng thái liên kết kho",
      dataIndex : "statusLinkWarehouse",
      key: "statusLinkWarehouse",
      render: (value) => {
        console.log(value)
        return <StatusTagWarehouse status={value}/>
      },
    },
    {
      title : "Mã liên kết",
      dataIndex : "apiKey",
      key : "apiKey",
    },

  ], []);
  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      autoComplete="off"
      labelAlign="left"
    >
      <BaseBorderBox>
        {/* <BaseBorderBox title={"Danh sách kho đã liên kết"}>
          <TableAnt
            columns={columns}
            dataSource={listWarehouse}
          />
        </BaseBorderBox> */}
        <BaseBorderBox title={'Thay đổi mã liên kết'}>
          {/* <Form.Item name={'warehouseId'} label = {'Danh sách kho'}>
            <Select
              options={optionsWarehouse}
              showSearch
              filterOption={filterSelectWithLabel}
            />
          </Form.Item> */}
          <Form.Item name={'apiKey'} label = {'Mã liên kết'}>
            <Input onChange={(e) => setNewApiKey(e.target.value)} value={newApiKey}/>
          </Form.Item>
        </BaseBorderBox>
      </BaseBorderBox>
      <Row justify={"end"} className="mt-3 mb-3">
        <Button
          type="primary"
          style={{ marginRight: "10px" }}
          onClick={() => updateApiKey({
            id,
            apiKey: newApiKey
          })}
        >
          Cập nhật
        </Button>
        <Button> Huỷ </Button>
      </Row>
    </Form>
  );
}
