import { Button, Form, Input, Radio } from "antd";
import React, { useEffect } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { DiscountType } from "../collaborator.modal";
type propsType = {
  onUpdateProduct: (p: DiscountType) => void;
  hide?: () => void;
  loading: boolean;
  defaultValue? : DiscountType
};
export default function DiscountForm({
  onUpdateProduct,
  loading,
  defaultValue,
  hide,
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const onFinish = (values: DiscountType) => {
    onUpdateProduct({...values});
    hide && hide();
  };
  useEffect(() => {
    if(defaultValue){
      form.setFieldsValue({
        ...defaultValue
      })
    };
  },[defaultValue])
  return (
    <Form initialValues={{discountType : "PERCENT"}} form={form} onFinish={onFinish} layout="inline">
      <Form.Item label="Chiết khấu" name={"value"}>
        <InputNumberAnt max={100} min={0} addonAfter={<div>%</div>}/>
      </Form.Item>
      <Form.Item name={"discountType"} hidden/>
      {/* <Form.Item name={"discountType"}>
        <Radio.Group buttonStyle="solid">
          <Radio.Button value="PERCENT">%</Radio.Button>
          <Radio.Button value="VALUE">Giá trị</Radio.Button>
        </Radio.Group>
      </Form.Item> */}
      <Button loading={loading} type="primary" htmlType="submit">
        Lưu
      </Button>
    </Form>
  );
}
