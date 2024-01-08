import React, { useEffect } from "react";
import { Button, Checkbox, Form, Input, Modal, Row, Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { useCreateUserGroup, useUpdateUserGroup } from "../userGroup.hook";
import toastr from "toastr";
import { DEFAULT_BRANCH_ID } from "~/constants/defaultValue";

type propsType = {
  isOpen?: boolean;
  onClose?: any;
  initGroup?: any;
  _id?: string;
};

const FormItem = Form.Item;
export default function UserGroupForm(props: propsType): React.JSX.Element {
  const { isOpen, onClose, initGroup, _id } = props;
  const { id: branchId } = useParams();
  // const { _id } = initGroup || {};
  const [form] = Form.useForm();
  const [isSubmitLoading, handleCreate] = useCreateUserGroup(onClose);
  const [, handleUpdate] = useUpdateUserGroup(onClose);
  const isLoading = false;

  useEffect(() => {
    form.resetFields();
  }, [initGroup, form]);

  const onFinish = (values: any) => {
    // handleCreate({
    //   ...values,
    //   branchId: branchId || DEFAULT_BRANCH_ID,
    // });
  };

  const onFinishFailed = (errorInfo: any) => {
    toastr.error(errorInfo);
    console.log("Failed:", errorInfo);
  };

  return (
    <Modal
      open={isOpen}
      footer={[]}
      onCancel={onClose}
      className="form-modal__user-group"
    >
      <Form
        name="basic"
        // labelCol={{ sm: 24, md: 24, lg: 8, xl: 8 }}
        // wrapperCol={{ sm: 24, md: 24, lg: 16, xl: 16 }}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        autoComplete="off"
        labelAlign="left"
        >
        <Row
          align="middle"
          justify="space-between"
          className="employee-group-form__logo-row"
        >
          <FormItem
            label="Tên nhóm nhân viên"
            name="name"
            rules={[
              {
                required: true,
                message: "Xin mời nhập tên nhóm nhân viên!"
              },
            ]}
          >
            {isLoading ? <Skeleton.Input active /> : <Input />}
          </FormItem>
          <FormItem
            label="Mô tả ngắn" name="description"
          >
            {isLoading ? <Skeleton.Input active /> : <Input />}
          </FormItem>
        </Row>

        <Row className="employee-group-form__submit-box">
          {isSubmitLoading ? (
            <Button disabled>Huỷ</Button>
          ) : (
            <Button onClick={onClose}>Huỷ</Button>
          )}
          <Button type="primary" htmlType="submit" loading={isSubmitLoading}>
            {_id ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Row>
      </Form>
    </Modal>
  );
}
