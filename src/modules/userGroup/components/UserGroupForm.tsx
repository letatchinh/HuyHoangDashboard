import React, { useEffect } from "react";
import { Button, Checkbox, Form, Input, Modal, Row, Skeleton } from "antd";
import { useParams } from "react-router-dom";
import { useCreateUserGroup, useGetUserGroup, useUpdateUserGroup } from "../userGroup.hook";
import toastr from "toastr";
import { DEFAULT_BRANCH_ID } from "~/constants/defaultValue";
import { useDispatch } from "react-redux";
import { userGroupSliceAction } from "../redux/reducer";

type propsType = {
  isOpen?: boolean;
  onClose?: any;
  initGroup?: any;
  id?: string;
  setReFetch?: any,
  reFetch?: any
};

const FormItem = Form.Item;
export default function UserGroupForm(props: propsType): React.JSX.Element {
  const { isOpen, onClose, initGroup, id , setReFetch, reFetch} = props;
  const dispatch = useDispatch();
  const resetAction = () => {
    return dispatch(userGroupSliceAction.resetAction());
  };
  const { groupId } = useParams();
  const [form] = Form.useForm();
  const [userGroup, isLoading] = useGetUserGroup(groupId);
  const [isSubmitLoading, handleCreate] = useCreateUserGroup(onClose);
  const [, handleUpdate] = useUpdateUserGroup(() => {
    onClose();
    resetAction();
    setReFetch(!reFetch);
  });

  useEffect(() => {
    if (userGroup && id) {
      form.setFieldsValue(userGroup);
    } else {
      form.resetFields();
    };
  }, [groupId,userGroup, form, id]);

  const onFinish = (values: any) => {
    if (id) {
      handleUpdate({
        ...values,
        id: id,
        branchId: DEFAULT_BRANCH_ID,
      });
    } else {
      handleCreate({
        ...values,
        branchId: DEFAULT_BRANCH_ID,
      });
    }
  };

  return (
    <Form
        form={form}
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        style={{ maxWidth: 600 }}
        onFinish={onFinish}
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
                message: "Xin mời nhập tên nhóm nhân viên!",
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
            {id ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Row>
      </Form>
  );
}
