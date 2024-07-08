import {
    Button,
  Col,
  DatePicker,
  Flex,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Switch,
} from "antd";
import TextArea from "antd/lib/input/TextArea";
import React from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { conditionKey, defaultConditions } from "../constants";
import CustomerApplyFormItem from "./CustomerApplyFormItem";
import TargetFormItem from "./TargetFormItem";
const CLONE_defaultConditions: any = defaultConditions;
type propsType = {};
export default function DiscountForm(props: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    console.log(values,'values');
    
  };
  console.log(form.getFieldsValue());
  const onValuesChange = (change: any) => {
    console.log(change, "change");
  };
  return (
    <Form
      onValuesChange={onValuesChange}
      labelCol={{ span: 6 }}
      wrapperCol={{ flex: 1 }}
      labelAlign="left"
      form={form}
      onFinish={onFinish}
      initialValues={{
        conditions: [
          {
            key: defaultConditions.BILL_FIRST.key,
            isActive: defaultConditions.BILL_FIRST.isActive,
          },
          {
            key: defaultConditions.BILL_PRICE.key,
            value: defaultConditions.BILL_PRICE.value,
            isActive: defaultConditions.BILL_PRICE.isActive,
          },
          {
            key: defaultConditions.PRODUCT_COUNT.key,
            value: defaultConditions.PRODUCT_COUNT.value,
            isActive: defaultConditions.PRODUCT_COUNT.isActive,
          },
        ],
        state : "PUBLIC",
        discount : {
          value : 0,
          type : "PERCENT"
        },
        applyFor : "BILL",
        target : "BILL",
      }}
    >
      <Row gutter={8}>
        <Col span={12}>
          <Form.Item name={"name"} label="Tên mã">
            <Input />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={"state"} label="Tình trạng">
            <Radio.Group>
              <Radio.Button value={"PUBLIC"}>Công khai</Radio.Button>
              <Radio.Button value={"PRIVATE"}>Nội bộ</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item name={["discount", "value"]} label="Giá trị giảm">
            <InputNumberAnt style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item name={["discount", "type"]} label="Kiểu giá trị">
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
          <Form.Item name={"applyFor"} label="Mã dùng để">
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

      <Form.Item labelCol={{ span: 3 }} name={"description"} label="Mô tả">
        <TextArea />
      </Form.Item>

      <Form.Item labelCol={{ span: 3 }} label="Điều kiện">
        <Form.List name={"conditions"}>
          {(fields, {}) => (
            <>
              {fields.map((field, index) => {
                const key = form.getFieldValue(["conditions", index, "key"]);

                return (
                  <Row gutter={16}>
                    <Col span={8}>
                      <span>{CLONE_defaultConditions[key].vi}</span>
                    </Col>

                    <Col flex={1}>
                      {key !== defaultConditions.BILL_FIRST.key && (
                        <Form.Item name={[index, "value"]}>
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

      <Row gutter={8}>
        <Col span={12}>
          <Form.Item name={"target"} label="Mã dành cho">
            <Radio.Group>
              <Radio.Button value={"BILL"}>Đơn hàng</Radio.Button>
              <Radio.Button value={"BILL_ITEM"}>Mặt hàng</Radio.Button>
            </Radio.Group>
          </Form.Item>
        </Col>
      </Row>

      <Form.Item shouldUpdate noStyle>
        {({getFieldValue}) => getFieldValue('target') === "BILL_ITEM" && <TargetFormItem form={form}/>}
      </Form.Item>
      <CustomerApplyFormItem form={form}/>
      <Form.Item
        valuePropName="checked"
        name={"multiple"}
        label="Cho phép dùng kết hợp"
      >
        <Switch />
      </Form.Item>

      <Flex justify={'center'}>
      <Button type="primary" htmlType="submit">tạo mới</Button>
      </Flex>
    </Form>
  );
}
