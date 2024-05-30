import { Button, Form, Row } from "antd";
import React from "react";
import SelectWarehouse from "./SelectWarehouse";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import SelectArea from "./SelectArea";
type propsType = {};
export default function SelectDefaultWarehouse(
  props: propsType
): React.JSX.Element {
  const [form] = Form.useForm();
  // const [data, ]
  const onFinish = (values: any) => {
    try {
    } catch (error) {}
  };
  const onValueChange = (values: any) => {
    console.log(values);
  };
  console.log(form.getFieldsValue(),'daddas')
  return (
    <Form
      form={form}
      onFinish={onFinish}
      onValuesChange={onValueChange}
      style={{ width: "100%" }}
      initialValues={{
        data: [{ name: "" }],
      }}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
    >
      <Breadcrumb title={"Cấu hình kho mặc định theo khu vực"} />
      <WhiteBox>
        <Row>
          <Button>Thêm khu vực</Button>
        </Row>
        <Form.List name={"data"}>
          {(fields, { add, remove }) => (
            <>
              {fields.map((field) => (
                <BaseBorderBox title={"Khu vực"}>
                    <SelectArea form={form}/>
                    <SelectWarehouse />
                </BaseBorderBox>
              ))}
            </>
          )}
        </Form.List>
        <Row justify={"end"} className="mt-3">
          <Button type="primary" htmlType="submit">Cập nhật </Button>
        </Row>
      </WhiteBox>
    </Form>
  );
}
