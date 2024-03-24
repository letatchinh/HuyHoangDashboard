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
import { GiftTwoTone } from "@ant-design/icons";
import { get } from "lodash";
import { convertInitSupplier, convertSubmitData } from "../supplier.service";
import CumulativeDiscountModule from '~/modules/cumulativeDiscount';
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";

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
      const submitData = convertSubmitData(values)
      if (!id) {
        onCreate(submitData);
      } else {
        onUpdate({ ...submitData, _id: id });
      }
    },
    [id, onCreate, onUpdate]
  );

  useEffect(() => {
    if (id && supplier) {
      const initSupplier = convertInitSupplier(supplier);
      form.setFieldsValue(initSupplier);
    }
  }, [form, id, supplier]);

  const onValuesChange = (value: any, values: any) => {
    const key = Object.keys(value)[0];
    switch (key) {
      case "cumulativeDiscount":
        const cumulativeDiscount = CumulativeDiscountModule.service.onDiscountChange(values[key]);
        console.log(cumulativeDiscount,'cumulativeDiscount');
        
        form.setFieldsValue({
          cumulativeDiscount,
        });
        break;

      default:
        break;
    }
  };
  return (
    <div className="flex-column-center">
      <Divider>
        <h5 className="text-center">{id ? "Cập nhật" : "Tạo mới"} nhà cung cấp</h5>
      </Divider>
      <Form
        form={form}
        labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
        wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
        labelAlign="left"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
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
            // cityCode={cityCode}
            // setCityCode={setCityCode}
            // districtCode={districtCode}
            // setDistrictCode={setDistrictCode}
            allowPhoneNumber={false}
            allowEmail={false}
          />
        </BaseBorderBox>
        {/* <BaseBorderBox
          title={
            <span>
              Chiết khấu <GiftTwoTone />
            </span>
          }
        >
          <CumulativeDiscountModule.components.DiscountList target={CumulativeDiscountModule.constants.TARGET.supplier} loading={isLoading} form={form} />
        </BaseBorderBox> */}
        <div className="btn-footer">
          <WithPermission permission={id ? POLICIES.UPDATE_SUPPLIER : POLICIES.WRITE_SUPPLIER}>
          <Button
            loading={isSubmitLoading}
            block
            type="primary"
            htmlType="submit"
          >
            {id ? "Cập nhật" : "Tạo mới"}
          </Button>
          </WithPermission>
          <Button onClick={onCancel} block danger>
            Huỷ
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormSupplier;
