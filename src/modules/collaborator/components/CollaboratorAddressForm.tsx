import { Button, Form } from "antd";
import { omit } from "lodash";
import React, { useEffect } from "react";
import AddressFormSection from "~/components/common/AddressFormSection";
import {
  AddressPartnerType,
  PayloadSubmitUpdateAddressPartner,
} from "../collaborator.modal";
type propsType = {
  id?: any;
  handleUpdate: (p: PayloadSubmitUpdateAddressPartner) => void;
  initialValues?: AddressPartnerType | null;
};
type FormField = {
  hash?: string | undefined;
  address: {
    street: string;
    wardId: string;
    districtId: string;
    cityId: string;
    isDefault: boolean;
  };
};
export default function CollaboratorAddressForm({
  id,
  handleUpdate,
  initialValues,
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const onFinish = (values: FormField) => {
    console.log(values,'values');
    
    const submitData: AddressPartnerType = {
      ...omit(values,['address']),
      ...values.address,
    };

    if (!initialValues) {
      handleUpdate({
        method: "add",
        data: [submitData],
        id,
      });
    } else {
      handleUpdate({
        method: "update",
        data: [submitData],
        id,
      });
    }
  };
  useEffect(() => {
    if (initialValues) {
        console.log(initialValues,'initialValues');
        
      form.setFieldsValue({
        address: {...initialValues},
        hash : initialValues?.hash,
        isDefault : initialValues?.isDefault || false
      });
    }
  }, [initialValues]);
  return (
    <Form
      initialValues={{
        isDefault: false,
      }}
      labelCol={{ span: 6 }}
      form={form}
      onFinish={onFinish}
    >
      <Form.Item hidden name="hash" />
      <Form.Item hidden name="isDefault" />
      <AddressFormSection
        form={form}
        allowPhoneNumber={false}
        allowEmail={false}
      />
      <Button style={{display : 'block',marginLeft : 'auto'}} type="primary" htmlType="submit">
        Lưu
      </Button>
    </Form>
  );
}
