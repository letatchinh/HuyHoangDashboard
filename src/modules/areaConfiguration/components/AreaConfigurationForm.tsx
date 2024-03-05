import { Button, Col, Divider, Form, Input, Row } from "antd";
import React, { useCallback, useEffect } from "react";
import RenderLoading from "~/components/common/RenderLoading";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import {
    useCreateAreaConfiguration, useGetAreaConfiguration, useResetAction
} from "../areaConfiguration.hook";
import { FieldTypeForm, propsTypeAreaConfigurationForm } from "../areaConfiguration.modal";

const AreaConfigurationForm = ({
  id,
  onCancel,
  onUpdate,
}: propsTypeAreaConfigurationForm): React.JSX.Element => {
  const [areaConfiguration, isLoading] = useGetAreaConfiguration(id);
  
  const [form] = Form.useForm();
  const [isSubmitLoading, onCreate] = useCreateAreaConfiguration(onCancel);

  useResetAction();

  const onFinish = useCallback(
    (values: FieldTypeForm) => {
      const submitData = values;
      if (!id) {
        onCreate(submitData);
      } else {
        onUpdate({ ...submitData, _id: id });
      }
    },
    [id, onCreate, onUpdate]
  );

  useEffect(() => {
    if (id && areaConfiguration) {
      form.setFieldsValue(areaConfiguration);
    }
  }, [form, id, areaConfiguration]);

  const onValuesChange = (value: any, values: any) => {
  }
  return (
    <div className="flex-column-center">
      <Divider>
        <h5 className="text-center">{id ? "Cập nhật" : "Tạo mới"} cấu hình vùng</h5>
      </Divider>
      <Form
        form={form}
        labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
        wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
        labelAlign="left"
        onFinish={onFinish}
        onValuesChange={onValuesChange}
      >
         <Row justify={"space-between"} align="middle" gutter={48}>
            <Col span={24}>
              <Form.Item<FieldTypeForm>
                label="Tên cấu hình vùng"
                name="name"
                rules={[
                  { required: true, message: "Vui lòng nhập tên cấu hình vùng" },
                ]}
              >
                {RenderLoading(isLoading,<Input />)}
              </Form.Item>
            </Col>
            </Row>
            
         <Row justify={"space-between"} align="middle" gutter={48}>
            <Col span={24}>
              <Form.Item<FieldTypeForm>
                label="Tên mô tả"
                name="alias"
                rules={[
                  { required: true, message: "Vui lòng nhập tên mô tả" },
                ]}
              >
                {RenderLoading(isLoading,<Input />)}
              </Form.Item>
            </Col>
            </Row>
        <div className="btn-footer">
          <WithPermission permission={id ? POLICIES.UPDATE_AREACONFIGURATION : POLICIES.UPDATE_AREACONFIGURATION}>
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

export default AreaConfigurationForm;
