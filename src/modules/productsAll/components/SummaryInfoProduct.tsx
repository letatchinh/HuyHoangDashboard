import { Form, Input } from "antd";
import React, { useEffect } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox";
type propsType = { data: any };

export default function SummaryInfoProduct(
  {data}: propsType
): React.JSX.Element {
  const [form] = Form.useForm();
  useEffect(() => {
    if (data) {
      const newData = {
        name: data?.name,
        productGroup: data?.productGroup?.name,
        codeBySupplier: data?.codeBySupplier,
        manufacturer: data?.manufacturer?.name,
        supplier: data?.supplier?.name,
        unit: data?.variant?.unit?.name,
      };
      form.setFieldsValue(newData);
    }
  }, [data]);
  return (
    <BaseBorderBox
      style={{
        padding: 10
      }}
    >
      <Form
      form={form}
      labelAlign="left"
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
    >
      <Form.Item name={"name"} label={"Tên sản phẩm"}>
        <Input readOnly />
      </Form.Item>
      <Form.Item name={"productGroup"} label={"Nhóm thuốc"}>
        <Input readOnly />
      </Form.Item>
      <Form.Item name={"codeBySupplier"} label={"Mã sản phẩm"}>
        <Input readOnly />
      </Form.Item>
      <Form.Item name={"manufacturer"} label={"Hãng sản xuất"}>
        <Input readOnly />
      </Form.Item>
      <Form.Item name={"supplier"} label={"Nhà cung cấp"}>
        <Input readOnly />
      </Form.Item>
      <Form.Item name={"unit"} label={"Đơn vị cơ bản"}>
        <Input readOnly />
      </Form.Item>
      </Form>
    </BaseBorderBox>
  );
}
