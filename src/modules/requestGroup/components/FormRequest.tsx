import { Button, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import { STATUS_REQUEST_GROUP } from "../constants";
import { RequestGroupSubmitType } from "../requestGroup.modal";
type propsType = {};
export default function FormRequest(props: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const onFinish = (values: RequestGroupSubmitType) => {};
  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={{ status: STATUS_REQUEST_GROUP.NEW }}
    >
      <Form.Item<RequestGroupSubmitType> name={"status"} hidden />
      <Form.Item<RequestGroupSubmitType> name={"requestById"} hidden />
      <Form.Item<RequestGroupSubmitType> name={"contentRequest"}>
        <TextArea rows={4} placeholder="Nhập nội dung yêu cầu!"/>
      </Form.Item>
      <Button block type="primary" htmlType="submit">
        Lưu
      </Button>
    </Form>
  );
}
