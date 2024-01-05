import { Button, Col, Divider, Form, Input, Row } from "antd";
import React, { useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import AddressFormSection from "~/modules/geo/components/AddressFormSection";
import { useGetSupplier } from "../supplier.hook";
import { FieldType, propsTypeFormSupplier } from "../supplier.modal";

const onFinish = (values: any) => {
  console.log("Success:", values);
};



const FormSupplier = ({id}:propsTypeFormSupplier) : React.JSX.Element => {
    const [supplier, isLoading] = useGetSupplier(id);
    
  const [form] = Form.useForm();
  const [cityCode, setCityCode]: any = useState();
  const [districtCode, setDistrictCode]: any = useState();
  return (
    <div className="flex-column-center">
      <Divider>
        <h5 className="text-center">Tạo mới chi nhánh</h5>
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
                label="Tên chi nhánh"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên chi nhánh" },
                ]}
              >
                <Input />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item<FieldType>
                label="Số điện thoại"
                name="phoneNumber"
                rules={[
                  { required: true, message: "Vui lòng nhập Số điện thoại" },
                ]}
              >
                <Input />
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
          <Button block type="primary" htmlType="submit">
            Tạo mới
          </Button>
          <Button block danger>
            Huỷ
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormSupplier;
