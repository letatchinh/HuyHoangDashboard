import { Form } from "antd";
import React from "react";
import { useParams } from "react-router-dom";
import BtnSubmit from "~/components/common/BtnSubmit";
import FormUpdateHeader from "~/components/common/FormUpdate/FormUpdateHeader";
import WhiteBox from "~/components/common/WhiteBox";
import { useCreateCourse, useUpdateCourse } from "../course.hook";
import CourseFormItemSection from "./CourseFormItemSection";
export default function CourseForm(): React.JSX.Element {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isSubmitLoading, onCreate] = useCreateCourse(() => form.resetFields());
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
      <FormUpdateHeader title="khoá học" isShowBtn={false}/>
      <WhiteBox>
      <CourseFormItemSection/>
      <BtnSubmit id={id} loading={isSubmitLoading} />
      </WhiteBox>
    </Form>
  );
}
