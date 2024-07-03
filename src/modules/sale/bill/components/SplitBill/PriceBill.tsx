import { Col, Form, Input, InputNumber, Row } from "antd";
import React from "react";
import BaseBorderBox from "~/components/common/BaseBoderBox";
import { formatNumberThreeComma } from "~/utils/helpers";
type propsType = {
  data?: any;
};
export default function PriceBill({ data }: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  return (
    <Row justify={"space-between"} align="middle" gutter={48} style={{ width: "100%" }}>
      <Col span={6}></Col>
      <Col span={12}>
        <BaseBorderBox>
          <Form
            labelAlign="left"
            labelCol={{ span: 10 }}
            wrapperCol={{ span: 14 }}
            initialValues={data}
            form={form}
          >
            <Form.Item
              label="Số lượng mặt hàng"
              name={"totalQuantity"}
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
            >
              <Input readOnly />
            </Form.Item>
            <Form.Item
              label="Tổng tiền"
              name={"totalPrice"}
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
            >
              <InputNumber
                addonAfter="VND"
                readOnly
                formatter={formatNumberThreeComma}
              />
            </Form.Item>
            <Form.Item
              label="Khách trả trước"
              name={"pair"}
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
            >
              <InputNumber
                addonAfter="VND"
                readOnly
                formatter={formatNumberThreeComma}
              />
            </Form.Item>
            <Form.Item
              label="Khách phải trả"
              name={"remaining"}
              labelCol={{ span: 10 }}
              wrapperCol={{ span: 14 }}
            >
              <InputNumber
                addonAfter="VND"
                readOnly
                formatter={formatNumberThreeComma}
              />
            </Form.Item>
          </Form>
        </BaseBorderBox>
      </Col>
      <Col span={6}></Col>
    </Row>
  );
}
