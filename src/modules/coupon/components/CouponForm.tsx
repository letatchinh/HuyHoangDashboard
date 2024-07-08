import {
  Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Switch,
  Tabs,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import dayjs from "dayjs";
import React, { useEffect } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { requireRules } from "~/constants/defaultValue";
import { defaultConditions, DEFAULT_COUPON, STATE, STATE_VI } from "../constants";
import { useCreateCoupon, useGetCoupon, useUpdateCoupon } from "../coupon.hook";
import { CouponBase } from "../coupon.modal";
import CustomerApplyFormItem from "./CustomerApplyFormItem";
import TargetFormItem from "./TargetFormItem";
const CLONE_defaultConditions: any = defaultConditions;
type propsType = {
  onCancel: (p?: any) => void;
  id?: any;
};
export default function CouponForm({
  onCancel,
  id,
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const [coupon, loading]: [CouponBase, boolean, any] = useGetCoupon(id);
  const [isSubmitLoading, create] = useCreateCoupon(onCancel);
  const [, update] = useUpdateCoupon(onCancel);
  const onFinish = (values: any) => {
    if (id) {
      update({
        _id: id,
        ...values,
      });
    } else {
      create(values);
    }
  };
  const onValuesChange = (change: any) => {
    console.log(change, "change");
  };

  useEffect(() => {
    if (id && coupon) {
      form.setFieldsValue({
        ...coupon,
        startDate: coupon?.startDate && dayjs(coupon.startDate),
        endDate: coupon?.endDate && dayjs(coupon.endDate),
      });
    }
  }, [coupon, id]);
  return (
    <Form
      scrollToFirstError
      onValuesChange={onValuesChange}
      labelCol={{ span: 8 }}
      wrapperCol={{ flex: 1 }}
      labelAlign="left"
      form={form}
      onFinish={onFinish}
      initialValues={DEFAULT_COUPON}
    >
      <Tabs type="card">
        <Tabs.TabPane key={"1"} tab="Thông tin">
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item rules={requireRules} name={"name"} label="Tên mã">
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item rules={requireRules} name={"giftCode"} label="Mã">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                rules={requireRules}
                name={["discount", "value"]}
                label="Giá trị giảm"
              >
                <InputNumberAnt style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={requireRules}
                name={["discount", "type"]}
                label="Kiểu giá trị"
              >
                <Radio.Group>
                  <Radio.Button value={"PERCENT"}>Phần trăm</Radio.Button>
                  <Radio.Button value={"VALUE"}>Giá trị</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item name={"limit"} label="Số lượng">
                <InputNumberAnt
                  style={{ width: "100%" }}
                  addonAfter={<div>Lần</div>}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                rules={requireRules}
                name={"applyFor"}
                label="Mã dùng để"
              >
                <Radio.Group>
                  <Radio.Button value={"BILL"}>Đơn hàng</Radio.Button>
                  <Radio.Button value={"SHIP"}>Free ship</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item name={"startDate"} label="Từ">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name={"endDate"} label="Đến">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                valuePropName="checked"
                name={"multiple"}
                label="Dùng kết hợp"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item rules={requireRules} name={"state"} label="Trạng thái">
                <Radio.Group>
                  <Radio.Button value={STATE.PUBLIC}>
                    {STATE_VI.PUBLIC}
                  </Radio.Button>
                  <Radio.Button value={STATE.PRIVATE}>
                    {STATE_VI.PRIVATE}
                  </Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item labelCol={{ span: 4 }} name={"description"} label="Mô tả">
            <TextArea />
          </Form.Item>

          <Form.Item labelCol={{ span: 4 }} label="Điều kiện">
            <Form.List name={"conditions"}>
              {(fields, {}) => (
                <>
                  {fields.map((field, index) => {
                    const key = form.getFieldValue([
                      "conditions",
                      index,
                      "key",
                    ]);

                    return (
                      <Row gutter={16}>
                        <Col span={8}>
                          <span>{CLONE_defaultConditions[key].vi}</span>
                        </Col>

                        <Col flex={1}>
                          {key === defaultConditions.BILL_FIRST.key && null}
                          {key === defaultConditions.BILL_PRICE.key && (
                            <Form.Item
                              name={[
                                index,
                                "value",
                                defaultConditions.BILL_PRICE.key,
                                "value",
                              ]}
                            >
                              <InputNumberAnt style={{ width: "100%" }} />
                            </Form.Item>
                          )}
                          {key === defaultConditions.PRODUCT_COUNT.key && (
                            <Form.Item
                              name={[
                                index,
                                "value",
                                defaultConditions.PRODUCT_COUNT.key,
                                "value",
                              ]}
                            >
                              <InputNumberAnt style={{ width: "100%" }} />
                            </Form.Item>
                          )}
                        </Col>

                        <Col span={6}>
                          <Form.Item
                            valuePropName="checked"
                            name={[index, "isActive"]}
                          >
                            <Switch />
                          </Form.Item>
                        </Col>
                        <Form.Item hidden name={[index, "key"]} />
                      </Row>
                    );
                  })}
                </>
              )}
            </Form.List>
          </Form.Item>
        </Tabs.TabPane>
        <Tabs.TabPane key={"2"} tab="Đối tượng áp dụng mã">
          <Row gutter={8}>
            <Col span={12}>
              <Form.Item
                rules={requireRules}
                name={"target"}
                label="Mã dành cho"
              >
                <Radio.Group>
                  <Radio.Button value={"BILL"}>Đơn hàng</Radio.Button>
                  <Radio.Button value={"BILL_ITEM"}>Mặt hàng</Radio.Button>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) =>
              getFieldValue("target") === "BILL_ITEM" && (
                <TargetFormItem form={form} />
              )
            }
          </Form.Item>
        </Tabs.TabPane>
        <Tabs.TabPane key={"3"} tab="Những ai được dùng mã">
          <CustomerApplyFormItem form={form} />
        </Tabs.TabPane>
      </Tabs>

      <Flex justify={"center"}>
        <Button loading={isSubmitLoading} type="primary" htmlType="submit">
          {id ? "Cập nhật" : "Tạo mới"}
        </Button>
      </Flex>
    </Form>
  );
}
