import { Button, Form, InputNumber } from "antd";
import React, { useEffect } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import useSalesGroupStore from "../salesGroupContext";
type propsType = {
  _id: string;
  targetLead: number;
};
type FormFieldType = {
  targetLead: number;
  _id: string;
};
export default function TargetSalesGroup({
  _id,
  targetLead,
  // targetMember,
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const { isSubmitLoading, updateSalesGroup } = useSalesGroupStore();
  const onFinish = (values: FormFieldType) => {
    updateSalesGroup(values);
  };

  useEffect(() => {
    form.setFieldsValue({
      _id,
      targetLead,
    });
  }, [_id, targetLead]);
  return (
    <div>
      <Form
        onFinish={onFinish}
        form={form}
        labelAlign="left"
        labelCol={{ span: 10 }}
        wrapperCol={{ span: 14 }}
        className='form-custom'
      >
        <Form.Item<FormFieldType> hidden name={"_id"} />
        <Form.Item<FormFieldType> name={"targetLead"} label="Nhóm">
          <InputNumberAnt min={0} style={{width : '100%'}}/>
        </Form.Item>
        <Button loading={isSubmitLoading} block size="small" type="primary" htmlType="submit">
          Cập nhật
        </Button>
      </Form>
    </div>
  );
}
