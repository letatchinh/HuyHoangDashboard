import React, { useEffect, useMemo } from "react";
import { Button, Form, Input, Row, Skeleton } from "antd";
import { useParams } from "react-router-dom";
import {  useGetCollaboratorGroup } from "../collaboratorGroup.hook";
import { DEFAULT_BRANCH_ID } from "~/constants/defaultValue";

type propsType = {
  isOpen?: boolean;
  onClose?: any;
  initGroup?: any;
  id?: string;
  setReFetch?: any,
  reFetch?: any
  isSubmitLoading?: boolean,
  handleCreate?: any,
  handleUpdateCollaborator?: any,
  setReFetchId?: any
};

const FormItem = Form.Item;
export default function CollaboratorGroupForm(props: propsType): React.JSX.Element {
  const {onClose, id ,isSubmitLoading, handleCreate,handleUpdateCollaborator,reFetch,setReFetchId} = props;
  const { groupId } = useParams();
  const [form] = Form.useForm();
  const memo = useMemo(() => groupId, [groupId, reFetch]);
  const [collaboratorGroup, isLoading] = useGetCollaboratorGroup(memo);
  useEffect(() => {
    if (collaboratorGroup && id) {
      form.setFieldsValue(collaboratorGroup);
    } else {
      form.resetFields();
    };
  }, [groupId, collaboratorGroup, form, id]);

  const onFinish = (values: any) => {
    if (id) {
      handleUpdateCollaborator({
        ...values,
        id: id,
        branchId: DEFAULT_BRANCH_ID,
      });
      setReFetchId(true);
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
        style={{ width: '95%' }}
        onFinish={onFinish}
        autoComplete="off"
        labelAlign="left"
        >
          <FormItem
            label="Tên nhóm cộng tác viên"
            name="name"
            rules={[
              {
                required: true,
                message: "Xin mời nhập tên nhóm cộng tác viên!",
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
