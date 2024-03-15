import { Button, Form, InputNumber, Popover, Typography } from "antd";
import React, { useEffect, useState } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import useSalesGroupStore from "../salesGroupContext";
import { formatter } from "~/utils/helpers";
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
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const [open, setOpen] = useState(false);
  const hide = () => {
    setOpen(false);
  };
  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
  };
  const { isSubmitLoading, updateSalesGroup } = useSalesGroupStore();
  const onFinish = (values: FormFieldType) => {
    updateSalesGroup(values);
    hide();
  };

  useEffect(() => {
    form.setFieldsValue({
      _id,
      targetLead,
    });
  }, [_id, targetLead,form]);

  return (
    <div>
        <Popover
        trigger={["click"]}
        content={
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
        }
        open={open}
        onOpenChange={handleOpenChange}
      >
        <Button type="text" ><Typography.Text strong>{formatter(targetLead)}</Typography.Text></Button>
      </Popover>
  
    </div>
  );
}
