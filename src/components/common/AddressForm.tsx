import { Button, Form, Popconfirm } from "antd";
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
      <Popconfirm
        title='Thay đổi địa chỉ giao hàng sẽ làm thay đổi lại phí vận chuyển, bạn có chắc chắn thay đổi ?'
        onConfirm={() => form.submit()}
        okText="Xác nhận"
        cancelText="Huỷ"
      >
        <Button type="primary">
          Xác nhận
        </Button>
      </Popconfirm>
    </Form>
  );
}
