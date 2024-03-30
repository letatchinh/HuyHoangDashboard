import React, { useEffect, useMemo } from "react";
import { Button, Form, Input, Row, Skeleton } from "antd";
import { useParams } from "react-router-dom";
import {  useGetEmployeeGroup } from "../employeeGroup.hook";
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
  handleUpdateEmployee?: any,
  setReFetchId?: any
};

const FormItem = Form.Item;
export default function EmployeeGroupForm(props: propsType): React.JSX.Element {
  const {onClose, id ,isSubmitLoading, handleCreate,handleUpdateEmployee,reFetch,setReFetchId} = props;
  const { groupId } = useParams();
  const [form] = Form.useForm();
  const memo = useMemo(() => groupId, [groupId, reFetch]);
  const [employeeGroup, isLoading] = useGetEmployeeGroup(memo);
  useEffect(() => {
    if (employeeGroup && id) {
      form.setFieldsValue(employeeGroup);
    } else {
      form.resetFields();
    };
  }, [groupId, employeeGroup, form, id]);

  const onFinish = (values: any) => {
    if (id) {
      handleUpdateEmployee({
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
