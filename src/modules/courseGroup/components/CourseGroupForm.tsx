import { Form, Input } from "antd";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import BtnSubmit from "~/components/common/BtnSubmit";
import Loading from "~/components/common/Loading/index";
import { requireRules } from "~/constants/defaultValue";
import { useCreateCourseGroup, useGetCourseGroup, useResetCourseGroup, useUpdateCourseGroup } from "../courseGroup.hook";
import FormUpdateHeader from "~/components/common/FormUpdate/FormUpdateHeader";
export default function CourseGroupForm(): React.JSX.Element {
  const { id } = useParams();
  const [form] = Form.useForm();
  const [isSubmitLoading,onCreate] = useCreateCourseGroup(() => form.resetFields());
  const [,onUpdate] = useUpdateCourseGroup();
  const [data,loading] = useGetCourseGroup(id);
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
  useEffect(() => {

    if(data && id){
      form.setFieldsValue({...data});
    }
    
  },[data,id]);
  useResetCourseGroup();
  return (
    <Form
      labelCol={{ span: 4 }}
      labelAlign="left"
      form={form}
      onFinish={onFinish}
    >
      <FormUpdateHeader id={id} loading={isSubmitLoading} title="nhóm khoá học"/>
      {loading && <Loading />}
      <Form.Item name={"name"} label="Tên" rules={requireRules}>
        <Input />
      </Form.Item>
    </Form>
  );
}
