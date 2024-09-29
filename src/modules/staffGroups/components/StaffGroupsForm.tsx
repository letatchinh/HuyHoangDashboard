import { Button, Form, Input, Row, Skeleton } from "antd";
import React, { useEffect } from "react";
import { useGetStaffGroup } from "../staffGroups.hook";

type propsType = {
  onClose?: any;
  id?: string | null;
  handleCreate?: any,
  handleUpdate?: any
  isSubmitLoading?: boolean
};

const FormItem = Form.Item;
export default function StaffGroupsForm(props: propsType): React.JSX.Element {
  const { isSubmitLoading, onClose, id, handleCreate,handleUpdate} = props;
  const [form] = Form.useForm();
  const [staffGroup, isLoading] = useGetStaffGroup(id);
  
  useEffect(() => {
    if (staffGroup && id) {
      form.setFieldsValue(staffGroup);
    } else {
      form.resetFields();
    };
  }, [staffGroup, form, id]);

  const onFinish = (values: any) => {
    if (id) {
      handleUpdate({
        ...values,
        id: id,
      });
    } else {
      handleCreate({
        ...values,
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
          {/* <FormItem
            label="Mô tả ngắn" name="description"
          >
            {isLoading ? <Skeleton.Input active /> : <Input />}
          </FormItem> */}
    
        <Row className="employee-group-form__submit-box" justify={"end"} align={"middle"}>
          <Button type="primary" htmlType="submit" loading={isSubmitLoading}>
            {id ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Row>
      </Form>
  );
}
