import { Form, Input, InputNumber } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import BtnSubmit from "~/components/common/BtnSubmit";
import { requireRules } from "~/constants/defaultValue";
import { useCreateCourse, useUpdateCourse } from "../course.hook";
export default function CourseForm(): React.JSX.Element {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isSubmitLoading,onCreate] = useCreateCourse();
  const [,onUpdate] = useUpdateCourse();
  const onFinish = (values: any) => {
    if(id){
      onUpdate({
        id,
        ...values
      });
    }else{
      onCreate({
        ...values
      })
    }
  };
  return (
    <Form
      labelCol={{ span: 4 }}
      labelAlign="left"
      form={form}
      onFinish={onFinish}
    >
      <Form.Item name={"name"} label="Tên khoá học" rules={requireRules}>
        <Input />
      </Form.Item>
      {/* <Form.Item name={"price"} label="Giá khoá học" rules={requireRules}>
        <InputNumber step={10000} />
      </Form.Item>
      <Form.Item
        name={"metaKeywords"}
        label="Meta Keywords"
        rules={requireRules}
      >
        <Input />
      </Form.Item> */}
      <BtnSubmit id={id} loading={isSubmitLoading}/>
    </Form>
  );
}
