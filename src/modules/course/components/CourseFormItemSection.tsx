import { Form, Input } from "antd";
import React from "react";
import InputNumberAnt from "~/components/common/Antd/InputNumberAnt";
import { requireRules } from "~/constants/defaultValue";
import CourseGroupSelect from "~/modules/courseGroup/components/CourseGroupSelect";
type propsType = {};
export default function CourseFormItemSection(
  props: propsType
): React.JSX.Element {
  return (
    <>
      <Form.Item name={"name"} label="Tên khoá học" rules={requireRules}>
        <Input />
      </Form.Item>
      <Form.Item
        name={"courseGroupId"}
        label="Nhóm khoá học"
        rules={requireRules}
      >
        <CourseGroupSelect />
      </Form.Item>
      <Form.Item name={"price"} label="Giá khoá học" rules={requireRules}>
        <InputNumberAnt step={10000} />
      </Form.Item>
    </>
  );
}
