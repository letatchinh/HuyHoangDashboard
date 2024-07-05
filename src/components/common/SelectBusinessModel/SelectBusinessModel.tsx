import { Col, Form, Row } from "antd";
import React from "react";
import SelectGroupPharmacy from "~/modules/groupPharmacy/components/SelectGroupPharmacy";
import SelectSaleChannel from "~/modules/saleChannel/components/SelectSaleChannel";
import SelectTypePharmacy from "~/modules/typePharmacy/components/SelectTypePharmacy";
type propsType = {
  query?: any;
  form: any;
};
export default function SelectBusinessModel(
  props: propsType
): React.JSX.Element {
  const { form } = props;

  return (
    <Row justify="space-between" style={{ marginTop: 20 }}>
      <Col span={6}>
        <Form.Item  shouldUpdate={(pre, current) => {
            return pre.salesChannelId !== current.salesChannelId;
          }} label="Kênh bán hàng">
          {({ setFieldValue }) => {
            // setFieldValue('customerGroupId',null);
            // setFieldValue('customerId',null);
            return (
              <Form.Item noStyle name="salesChannelId">
                <SelectSaleChannel
                  validateFirst={false}
                  form={form}
                  style={{ minWidth: 200 }}
                  showIcon={false}
                  size={"middle"}
                  divisionText="B2B"
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          shouldUpdate={(pre, current) => {
            return pre.customerGroupId !== current.customerGroupId;
          }}
          label="Nhánh KH"
        >
          {({ getFieldValue, setFieldValue }) => {
            // setFieldValue('customerId',null);
            return (
              <Form.Item noStyle name={"customerGroupId"}>
                <SelectTypePharmacy
                  validateFirst={false}
                  form={form}
                  style={{ minWidth: 200 }}
                  showIcon={false}
                  size={"middle"}
                  disabled={!!!getFieldValue("salesChannelId")}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Col>
      <Col span={6}>
        <Form.Item
          label="Nhóm KH"
          shouldUpdate={(pre, current) => {
            return pre.customerId !== current.customerId;
          }}
        >
          {({ getFieldValue }) => {
            return (
              <Form.Item noStyle name="customerId">
                <SelectGroupPharmacy
                  validateFirst={false}
                  form={form}
                  style={{ minWidth: 200 }}
                  showIcon={false}
                  size={"middle"}
                  disabled={!!!getFieldValue("customerGroupId")}
                />
              </Form.Item>
            );
          }}
        </Form.Item>
      </Col>
    </Row>
  );
}
