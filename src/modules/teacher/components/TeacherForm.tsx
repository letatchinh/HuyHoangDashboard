import { Button, Col, Flex, Form, Input, Row, Select, Skeleton } from "antd";
import { omit } from "lodash";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Account from "~/components/common/Account";
import AddressFormSection from "~/components/common/AddressFormSection";
import UploadCustom from "~/components/common/Upload/UploadCustom";
import WhiteBox from "~/components/common/WhiteBox";
import { useCreateTeacher, useGetTeacher, useResetTeacher, useUpdateTeacher } from "../teacher.hook";

const { Option } = Select;
const FormItem = Form.Item;

export default function TeacherForm(): React.JSX.Element {
  const {id} = useParams();
  const [form] = Form.useForm();
  const [teacher, isLoading] = useGetTeacher(id);
  const [isSubmitLoading,onCreate] = useCreateTeacher(() => form.resetFields());
  const [,onUpdate] = useUpdateTeacher();
  const [statusAccount, setStatusAccount] = useState<"ACTIVE" | "INACTIVE">(
    id ? "INACTIVE" : "ACTIVE"
  );
  useEffect(() => {
    if (id) {
      form.setFieldsValue(teacher);
    } else {
      form.resetFields();
    }
  }, [teacher, id]);
  useResetTeacher();
  const onFinish = (values: any) => {
    try {
      const user = {
        ...values,
        idNumber: values?.idNumber || "",
      };
      if (id) {
        const data: object = {
          ...user,
          id: id,
        };
        if (statusAccount === "ACTIVE") {
          onUpdate({ ...data });
        } else {
          onUpdate({
            ...omit(data, ["userName", "password", "confirmPassword"]),
          });
        }
      } else {
        onCreate({ ...omit(user, ["userId", "updateAccount"]) });
      }
    } catch (error) {
      console.log(error);
    }
  };
  const onValuesChange = ({ address }: any) => {};

  return (
    <Form
      form={form}
      autoComplete="off"
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      scrollToFirstError
      requiredMark={false}
      labelAlign="left"
      labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
      wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
    >
      <h4>{id ? "Cập nhật" : "Tạo mới" + " giảng viên"}</h4>
    <WhiteBox>
    <Row
        gutter={48}
        align="middle"
        justify="space-between"
        className="user-form__logo-row"
      >
        <Col span={12}>
          <Row gutter={36}>
            <Col span={24}>
              <FormItem
                label="Họ và tên"
                name="fullName"
                rules={[
                  { required: true, message: "Xin mời nhập tên!" },
                ]}
              >
                {isLoading ? <Skeleton.Input active /> : <Input />}
              </FormItem>
            </Col>
          </Row>

          <FormItem label="Giới tính" name="gender">
            {isLoading ? (
              <Skeleton.Input active />
            ) : (
              <Select>
                <Option value="M" key="male">
                  Nam
                </Option>
                <Option value="F" key="female">
                  Nữ
                </Option>
              </Select>
            )}
          </FormItem>
        </Col>
        <Col span={12} className="employee-form__upload-logo">
          <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => (
              <Form.Item name={'avatar'}>
                <UploadCustom
                className="fullWidthUpload"
                typeComponent={"image"}
                resource="user"
                onHandleChange={(url) => form.setFieldsValue({ avatar: url })}
                value={getFieldValue("avatar")}
                customPath={`/${id}`}
                placeholder="Avatar"
              />
              </Form.Item>
            )}
          </Form.Item>
        </Col>
      </Row>
    </WhiteBox>
    <WhiteBox>
    <AddressFormSection
        isLoading={isLoading}
        form={form}
        required={false}
      />
        <Row
        gutter={48}
        align="middle"
        justify="space-between"
        className="user-form__logo-row"
      >
        <Col span={12}>
          <Row gutter={36}>
            <Col span={24}>
              <FormItem
                label="CMND/CCCD"
                name="idNumber"
                rules={[
                  {
                    required: false,
                    pattern: new RegExp(/^[0-9]{9,12}$/),
                    message: "Xin vui lòng nhập đúng số CMND/CCCD!",
                  },
                ]}
              >
                {isLoading ? <Skeleton.Input active /> : <Input />}
              </FormItem>
            </Col>
          </Row>
        </Col>
        
      </Row>
    </WhiteBox>

    <WhiteBox>
    <Form.Item shouldUpdate noStyle>
            {({ getFieldValue }) => (
              <Form.Item name={'portfolio'} label="Portfolio">
                <UploadCustom
                className="fullWidthUpload"
                typeComponent={"image"}
                resource="user"
                onHandleChange={(url) => form.setFieldsValue({ portfolio: url })}
                value={getFieldValue("portfolio")}
                customPath={`/${id}`}
                placeholder="Portfolio"
              />
              </Form.Item>
            )}
          </Form.Item>
    </WhiteBox>

    <WhiteBox>
    <Account
        isLoading={isLoading}
        required={false}
        setStatusAccount={setStatusAccount}
        statusAccount={statusAccount}
      />
    </WhiteBox>
      <Flex style={{marginTop : 10}} justify={'center'}>
      <Button loading={isSubmitLoading} type="primary" htmlType="submit">
            {id ? "Cập nhật" : "Tạo mới"}
          </Button>
      </Flex>
    </Form>
  );
}
