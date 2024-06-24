import React, { useMemo } from "react";
import { Button, Form, Input, Popconfirm, Row, Select } from "antd";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import TableAnt from "~/components/Antd/TableAnt";
import { ColumnsType } from "antd/es/table";
import dayjs from "dayjs";
import { useGetBranch, useGetListWarehouseInPMS } from "../branch.hook";
import { filterAcrossAccents, filterSelectWithLabel } from "~/utils/helpers";
import StatusTagWarehouse from "./StatsusTagWarehouse";
import useBranchContext from "../store/BranchContext";
type propsType = {
  updateApiKey?: any;
  id: string | null | undefined;
};
export default function ApiKeyForm({updateApiKey, id}: propsType): React.JSX.Element {
  const [newApiKey, setNewApiKey] = React.useState<string>("");
  const [form] = Form.useForm();
  const {closeFormApiKey} = useBranchContext();

  const onValuesChange = (value: string) => {
  };

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
        <Button onClick={closeFormApiKey}> Huỷ </Button>
      </Row>
    </Form>
  );
}
