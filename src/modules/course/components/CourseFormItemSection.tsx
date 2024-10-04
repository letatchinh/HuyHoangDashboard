import { Form, Input } from "antd";
import React from "react";
import InputNumberAnt from "~/components/common/Antd/InputNumberAnt";
import UploadCustom from "~/components/common/Upload/UploadCustom";
import { requireRules } from "~/constants/defaultValue";
import CourseGroupSelect from "~/modules/courseGroup/components/CourseGroupSelect";
import Editors from "~/utils/Editors";
type propsType = {
  id? : string;
};
export default function CourseFormItemSection(
  {id}: propsType
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

      <Form.Item
        name={"description"}
        label="Mô tả"
        rules={requireRules}
      >
        <Editors />
      </Form.Item>

      {id && <Form.Item shouldUpdate noStyle>
        {({ getFieldValue,setFieldsValue }) =>
         <Form.Item name={"image"} label="Ảnh bìa">
          <UploadCustom
                className="fullWidthUpload"
                typeComponent={'image'}
                resource="course"
                onHandleChange={(url) => setFieldsValue({image : url})}
                value={getFieldValue('image')}
                customPath={`/${id}`}
              />
         </Form.Item>
        }
      </Form.Item>}
    </>
  );
}
