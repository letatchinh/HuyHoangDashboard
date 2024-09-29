import { PlusOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, InputNumber, Row } from "antd";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import InputNumberAnt from "~/components/common/Antd/InputNumberAnt";
import FormUpdateHeader from "~/components/common/FormUpdate/FormUpdateHeader";
import WhiteBox from "~/components/common/WhiteBox";
import { requireRules } from "~/constants/defaultValue";
import CourseGroupSelect from "~/modules/courseGroup/components/CourseGroupSelect";
import ScheduleAdd from "~/modules/schedule/components/ScheduleAdd";
import ScheduleList from "~/modules/schedule/components/ScheduleList";
import { useGetCourse, useUpdateCourse } from "../course.hook";
import CourseFormItemSection from "./CourseFormItemSection";
type propsType = {};
export default function CourseUpdateForm(props: propsType): React.JSX.Element {
  const { id } = useParams();
  const [data, loading] = useGetCourse(id);
  const [, onUpdate] = useUpdateCourse();

  const [form] = Form.useForm();
  const onFinish = (values: any) => {
    onUpdate({ id, ...values });
  };
  useEffect(() => {
    if (data && id) {
      form.setFieldsValue(data);
    }
  }, [data]);
  return (
    <div>
      <Form
        onFinish={onFinish}
        labelCol={{ span: 4 }}
        labelAlign="left"
        form={form}
      >
        <FormUpdateHeader id={id} title="Cập nhật khoá học" />
        <WhiteBox title="Thông tin khoá học">
          <CourseFormItemSection />
        </WhiteBox>

        <WhiteBox title="Lộ trình học">
          <ScheduleList />
          <ScheduleAdd action="CREATE" />
        </WhiteBox>
      </Form>
    </div>
  );
}
