import { Button, Form, Input, Radio } from "antd";
import React, { useEffect } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { DiscountOtherType } from "../bill.modal";
type propsType = {
    onAdd : (p:any) => void,
    onUpdate : (p:any,index:number) => void,
    initData? : DiscountOtherType,
    index?:number
};
export default function DiscountOtherForm({onAdd, onUpdate,initData,index}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const onFinish = (values: DiscountOtherType) => {
    if(Number.isFinite(index)){
        onUpdate(values,index || 0)
    }else{
        onAdd(values);
    }
  };
  useEffect(() => {
    form.setFieldsValue({
        ...initData
    })
  },[initData]);
  const onValueChange = (value: any,values:DiscountOtherType) => {
    if(values?.discountType === 'PERCENT' && values?.value > 100){
        form.setFieldsValue({
            value : 100
        })
    }
  }
  return (
    <Form initialValues={{
        discountType : 'PERCENT'
    }} form={form} onFinish={onFinish} onValuesChange={onValueChange}>
      <Form.Item<DiscountOtherType> name={"name"} label="Mô tả">
        <Input />
      </Form.Item>
      <Form.Item<DiscountOtherType> name={"value"} label="Giá trị">
        <InputNumberAnt
          addonAfter={
            <Form.Item<DiscountOtherType>
              style={{ marginBottom: "unset" }}
              name={"discountType"}
            >
              <Radio.Group size="small" buttonStyle="solid">
                <Radio.Button value="PERCENT">%</Radio.Button>
                <Radio.Button value="VALUE">Giá trị</Radio.Button>
              </Radio.Group>
            </Form.Item>
          }
        />
      </Form.Item>
      <Button type="primary" htmlType="submit">
        Lưu
      </Button>
    </Form>
  );
}
