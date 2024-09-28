import { PlusOutlined } from "@ant-design/icons";
import {
    Button,
    Col, Form,
    Input, Row
} from "antd";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import InputNumberAnt from "~/components/common/Antd/InputNumberAnt";
import FormUpdateHeader from "~/components/common/FormUpdate/FormUpdateHeader";
import WhiteBox from "~/components/common/WhiteBox";
import { requireRules } from "~/constants/defaultValue";
import ScheduleAdd from "~/modules/schedule/components/ScheduleAdd";
import ScheduleList from "~/modules/schedule/components/ScheduleList";
import { useGetCourse } from "../course.hook";
type propsType = {};
export default function CourseUpdateForm(props: propsType): React.JSX.Element {
  const {id} = useParams();
  const [data,loading] = useGetCourse(id)
  const [form] = Form.useForm();
  const onFinish = (values : any) => {
    console.log(values);
    
  }
  useEffect(() => {
    if(data && id){
      form.setFieldsValue(data)
    }
  },[data])
  return (
    <div>
      <Form form={form}>
        <FormUpdateHeader title="Cập nhật khoá học"/>
        <WhiteBox title="Thông tin khoá học">
          <Form.Item name={"name"} label="Tên khoá học" rules={requireRules}>
            <Input />
          </Form.Item>
          {/* <Row gutter={8}>
            <Col span={8}>
              <Form.Item
                name={"price"}
                label="Giá khoá học"
                rules={requireRules}
              >
                <InputNumberAnt step={10000} addonAfter={<div>VNĐ</div>} />
              </Form.Item>
            </Col>
            <Col flex={1}>
              <Form.Item
                name={"metaKeywords"}
                label="Meta Keywords"
                rules={requireRules}
              >
                <Input />
              </Form.Item>
            </Col>
          </Row> */}
        </WhiteBox>

        <WhiteBox title="Lộ trình học">
              <ScheduleList />
              <ScheduleAdd action="CREATE"/>
        </WhiteBox>
      </Form>
    </div>
  );
}
