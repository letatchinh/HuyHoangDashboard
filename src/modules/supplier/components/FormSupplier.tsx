import { Button, Col, Divider, Form, Input, Row } from "antd";
import React, { useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import AddressFormSection from "~/components/common/AddressFormSection";
import {
  useGetSupplier,
  useCreateSupplier,
  useResetAction,
} from "../supplier.hook";
import { FieldType, propsTypeFormSupplier } from "../supplier.modal";
import { useCallback } from "react";
import { useEffect } from "react";
import RenderLoading from "~/components/common/RenderLoading";
import { validatePhoneNumberAntd } from "~/utils/validate";

const FormSupplier = ({
  id,
  onCancel,
  onUpdate,
}: propsTypeFormSupplier): React.JSX.Element => {
  const [supplier, isLoading] = useGetSupplier(id);
  
  const [form] = Form.useForm();
  const [cityCode, setCityCode]: any = useState();
  const [districtCode, setDistrictCode]: any = useState();
  const [isSubmitLoading, onCreate] = useCreateSupplier(onCancel);

  useResetAction();
  const onFinish = useCallback(
    (values: FieldType) => {
      if (!id) {
        onCreate(values);
      } else {
        onUpdate({ ...values, _id: id });
      }
    },
    [id, onCreate, onUpdate]
  );

  useEffect(() => {
    if (id && supplier) {
      form.setFieldsValue(supplier);
    }
  }, [form, id, supplier]);
  return (
    <div className="flex-column-center">
      <Divider>
        <h5 className="text-center">{id ? "Cập nhật" : "Tạo mới"} chi nhánh</h5>
      </Divider>
      <Form
        form={form}
        labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
        wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
        labelAlign="left"
        onFinish={onFinish}
      >
        <BaseBorderBox title={"Thông tin"}>
          <Row justify={"space-between"} align="middle" gutter={48}>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Tên nhà cung cấp"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên nhà cung cấp" },
                ]}
              >
                {RenderLoading(isLoading,<Input />)}
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Số điện thoại"
                name="phoneNumber"
                rules={validatePhoneNumberAntd}
              >
                {RenderLoading(isLoading,<Input />)}
              </Form.Item>
            </Col>
          </Row>
        </BaseBorderBox>
        <BaseBorderBox title={"Địa chỉ"}>
          <AddressFormSection
            form={form}
            cityCode={cityCode}
            setCityCode={setCityCode}
            districtCode={districtCode}
            setDistrictCode={setDistrictCode}
            allowPhoneNumber={false}
            allowEmail={false}
          />
        </BaseBorderBox>
        <div className="btn-footer">
          <Button
            loading={isSubmitLoading}
            block
            type="primary"
            htmlType="submit"
          >
            {id ? "Cập nhật" : "Tạo mới"}
          </Button>
          <Button onClick={onCancel} block danger>
            Huỷ
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormSupplier;
