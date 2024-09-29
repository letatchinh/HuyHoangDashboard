import { Form, Input, Radio } from "antd";
import React, { useEffect } from "react";
import BtnSubmit from "~/components/common/BtnSubmit";
import UploadCustom from "~/components/common/Upload/UploadCustom";
import Editors from "~/utils/Editors";
import {
  useCreateScheduleItem,
  useUpdateScheduleItem,
} from "../scheduleItem.hook";
import { ScheduleItemBase } from "../scheduleItem.modal";
type propsType = {
  dataItemUpdate?: ScheduleItemBase;
  scheduleId: string;
  onCancel: () => void;
};
export default function ScheduleItemForm({
  dataItemUpdate,
  onCancel,
  scheduleId,
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const [isSubmitLoading, onCreate] = useCreateScheduleItem(onCancel);
  const [, onUpdate] = useUpdateScheduleItem(onCancel);
  const onFinish = (values: ScheduleItemBase) => {
    const submitData = {
      ...values,
      scheduleId,
    };
    if (dataItemUpdate) {
      onUpdate({
        id: dataItemUpdate?._id,
        ...submitData,
      });
    } else {
      onCreate({ ...submitData });
    }
  };
  useEffect(() => {
    console.log(dataItemUpdate,'dataItemUpdate');
    
    if (dataItemUpdate) {
      form.setFieldsValue({ ...dataItemUpdate });
    }
  }, [dataItemUpdate]);

  const onValuesChange = (valueChange : any) => {
    const value : any = Object.values(valueChange)[0];
    const key = Object.keys(valueChange)[0];
    if(key === 'contentType'){
        form.setFieldsValue({
            contentSrc : ""
        })
    }
  }
  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 4 }}
      labelAlign="left"
      initialValues={{ contentType: "document" }}
      onValuesChange={onValuesChange}
    >
      <Form.Item name={"name"} label="Tiêu đề">
        <Input />
      </Form.Item>
      <Form.Item name={"contentType"} label="Loại tài liệu">
        <Radio.Group
          options={[
            { label: "Tài liệu", value: "document" },
            { label: "Video", value: "video" },
            { label: "Văn bản", value: "html" },
          ]}
        />
      </Form.Item>
      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue,setFieldsValue }) =>
         <Form.Item name={"contentSrc"} label="Tài liệu">
            { getFieldValue("contentType") === "html" ? (
            <Editors />
          ) : (
              <UploadCustom
                className="fullWidthUpload"
                typeComponent={getFieldValue("contentType")}
                resource="scheduleItem"
                onHandleChange={(url) => setFieldsValue({contentSrc : url})}
                value={getFieldValue('contentSrc')}
              />
          )}
         </Form.Item>
        }
      </Form.Item>
      <BtnSubmit loading={isSubmitLoading} id={dataItemUpdate} />
    </Form>
  );
}
