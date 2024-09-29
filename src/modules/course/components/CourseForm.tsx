import { Form, Input, InputNumber } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import BtnSubmit from "~/components/common/BtnSubmit";
import { requireRules } from "~/constants/defaultValue";
import CourseGroupSelect from "~/modules/courseGroup/components/CourseGroupSelect";
import { useCreateCourse, useUpdateCourse } from "../course.hook";
import CourseFormItemSection from "./CourseFormItemSection";
export default function CourseForm(): React.JSX.Element {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isSubmitLoading, onCreate] = useCreateCourse();
  const [, onUpdate] = useUpdateCourse();
  const onFinish = (values: any) => {
    if (id) {
      onUpdate({
        id,
        ...values,
      });
    } else {
      onCreate({
        ...values,
      });
    }
  };
  return (
    <Form
      labelCol={{ span: 4 }}
      labelAlign="left"
      form={form}
      onFinish={onFinish}
    >
      <CourseFormItemSection />
      <BtnSubmit id={id} loading={isSubmitLoading} />
    </Form>
  );
}
