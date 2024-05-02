import { Button, Form } from "antd";
import React from "react";
import AddressFormSection from "./AddressFormSection";
type FormField = {
  address: {
    cityId: string;
    districtId: string;
    wardId: string;
    street: string;
  };
};
type propsType = {
  onSubmit: (values: FormField) => void;
};
export default function AddressForm({
  onSubmit,
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const onFinish = (values: FormField) => {
    onSubmit(values);
  };
  return (
    <Form labelCol={{span  : 8}} onFinish={onFinish} form={form}>
      <AddressFormSection
        form={form}
        allowPhoneNumber={false}
        allowEmail={false}
      />
      <Button type="primary" htmlType="submit">
        Xác nhận
      </Button>
    </Form>
  );
}
