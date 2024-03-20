import {
  CheckCircleTwoTone,
  CheckOutlined,
  EditTwoTone,
  SaveTwoTone,
} from "@ant-design/icons";
import { Button, Form, Input, Space, Typography } from "antd";
import React, { useCallback, useEffect, useState } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { formatter } from "~/utils/helpers";
import { UpdateOrderItem } from "../orderItem.modal";

type propsType = {
  quantity: number;
  unitPrice: number;
  onChangeStatusOrderItem: (p: UpdateOrderItem) => void;
  id: string;
};
type FieldType = {
  quantity: number;
  unitPrice: number;
};
const [form] = Form.useForm();
export default function UpdateQuantity({
  quantity,
  unitPrice,
  onChangeStatusOrderItem,
  id,
}: propsType): React.JSX.Element {
  const onFinish = (values: FieldType) => {
    const submitData: UpdateOrderItem = {
      ...values,
      id,
    };

    onChangeStatusOrderItem(submitData);
  };
  useEffect(() => {
    if (!id) {
      form.resetFields();
    } else {
      form.setFieldsValue({
        quantity,
        unitPrice,
      });
    }
  }, [quantity, unitPrice, id]);
  return (
    <>
      <Form
        name="basic"
        labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
        wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
        labelAlign="left"
        style={{ maxWidth: 800 }}
        form={form}
        onFinish={onFinish}
      >
        <Form.Item<FieldType> label="Số lượng" name="quantity">
          <Input />
        </Form.Item>
        <Form.Item<FieldType> label="Đơn giá" name="unitPrice">
          <Input />
        </Form.Item>
        <Form.Item
          style={{ width: "950px" }}
          wrapperCol={{ offset: 8, span: 12 }}
        >
          <Button type="primary" htmlType="submit">
            Cập nhật
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
