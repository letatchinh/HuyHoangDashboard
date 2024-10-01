import { PlusOutlined } from "@ant-design/icons";
import { Button, Flex, Form, Input, Modal } from "antd";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import Loading from "~/components/common/Loading/index";
import { requireRules } from "~/constants/defaultValue";
import { useCreateSchedule, useGetSchedule, useUpdateSchedule } from "../schedule.hook";
type propsType = {
    action : "CREATE" | "UPDATE",
    id ? : any,
    onCancel? : () => void
};
export default function ScheduleAdd({action,id,onCancel}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const {id : courseId} = useParams();
  const [submitLoading,onCreate] = useCreateSchedule(onCancel && onCancel);
  const [data,loading] = useGetSchedule(id);
  const [,onUpdate] = useUpdateSchedule(onCancel && onCancel);
  const onFinish = (values: any) => {
    
    
    if(action === "CREATE"){
        const payload = {
            ...values,
            courseId,
        }
        return onCreate(payload);
    }
    if(action === "UPDATE"){
        const payload = {
            ...values,
            id,
        }
        return onUpdate(payload);
    }
  };
  useEffect(() => {
    if(action === "CREATE"){
        return form.resetFields();
    }
    if(action === "UPDATE"){
        form.setFieldsValue({
            ...data,
        })
    }
  },[id,action,data])
  return (
    <Form style={{ marginTop: 5 }} form={form} onFinish={onFinish}>
      <Flex>
        <Form.Item style={{ width: "100%" }} name={"name"} rules={requireRules}>
          <Input placeholder="Tên lộ trình" />
        </Form.Item>
        <Button
          style={{ paddingInline: 40 }}
          icon={<PlusOutlined />}
          type="primary"
          onClick={() => form.submit()}
          loading={submitLoading}
        >
          {action === "CREATE" ? "Thêm mới" : "Cập nhật"}
        </Button>
      </Flex>
    </Form>
  );
}
