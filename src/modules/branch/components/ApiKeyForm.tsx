import React, { useMemo } from "react";
import { Button, Form, Input, Popconfirm, Row, Select } from "antd";
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
  onClose?: () => void;
  onDelete?: (branchId: string | undefined |null) => void;
};
export default function ApiKeyForm({updateApiKey, id,onClose, onDelete}: propsType): React.JSX.Element {
  const [newApiKey, setNewApiKey] = React.useState<string>("");
  const [form] = Form.useForm();

  const onValuesChange = (value: string) => {
  };

  // const columns: ColumnsType = useMemo(() => [
  //   {
  //     title : "Tên kho",
  //     dataIndex : "warehouse",
  //     key: "warehouse",
  //     render: (warehouse) => <span>{warehouse?.name}</span>,
  //   },
  //   {
  //     title : "Ngày liên kết",
  //     dataIndex : "createdAt",
  //     key: "createdAt",
  //     render: (createdAt) => dayjs(createdAt).format("DD/MM/YYYY HH:mm:ss"),
  //   },
  //   {
  //     title : "Trạng thái liên kết kho",
  //     dataIndex : "statusLinkWarehouse",
  //     key: "statusLinkWarehouse",
  //     render: (value) => {
  //       console.log(value)
  //       return <StatusTagWarehouse status={value}/>
  //     },
  //   },
  //   {
  //     title : "Mã liên kết",
  //     dataIndex : "apiKey",
  //     key : "apiKey",
  //   },

  // ], []);
  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      initialValues={{ remember: true }}
      onValuesChange={onValuesChange}
      autoComplete="off"
      labelAlign="left"
    >
      <BaseBorderBox>
          <Form.Item name={'apiKey'} label = {'Mã liên kết'}>
            <Input onChange={(e) => setNewApiKey(e.target.value)} value={newApiKey}/>
          </Form.Item>
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
        <Button onClick={onClose}> Huỷ </Button>
      </Row>
    </Form>
  );
}
