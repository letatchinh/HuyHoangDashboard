import { Button, Form, Row } from "antd";
import React from "react";
import SelectWarehouse from "./SelectWarehouse";
import Breadcrumb from "~/components/common/Breadcrumb";
import WhiteBox from "~/components/common/WhiteBox";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import SelectArea from "./SelectArea";
import { PlusOutlined } from "@ant-design/icons";
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
  const onValueChange = (changedValues: any, allValues: any) => {
    console.log(allValues);
  };
  console.log(form.getFieldsValue(), "getFieldsValue");
  return (
    <>
      <Form
        form={form}
        onFinish={onFinish}
        onValuesChange={onValueChange}
        style={{ width: "100%" }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign="left"
      >
        <Breadcrumb title={"Cấu hình kho mặc định theo khu vực"} />
        <WhiteBox>
          <Form.List name={"warehouses"}>
            {(fields, { add, remove }) => (
              <>
                {fields.map((field, index) => {
                  return (
                    <BaseBorderBox title={`Khu vực ${index + 1}`} key={field.key}>
                      <SelectArea form={form} index={index} />
                      <SelectWarehouse index={index} />
                    </BaseBorderBox>
                  );
                })}
                <Form.Item>
                  <Row>
                    <Button
                      type="dashed"
                      onClick={() => add({})}
                      style={{
                        width: "100%",
                        margin: "auto",
                      }}
                      icon={<PlusOutlined />}
                    >
                      Thêm khu vực
                    </Button>
                  </Row>
                </Form.Item>
              </>
            )}
          </Form.List>
          <Row justify={"end"} className="mt-3">
            <Button type="primary" htmlType="submit">
              Cập nhật{" "}
            </Button>
          </Row>
        </WhiteBox>
      </Form>
    </>
  );
}
