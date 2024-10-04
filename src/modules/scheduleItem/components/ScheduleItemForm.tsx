import { Divider, Form, Input, Radio } from "antd";
import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import BtnSubmit from "~/components/common/BtnSubmit";
import PdfPreview from "~/components/common/PdfPreview";
import UploadCustom from "~/components/common/Upload/UploadCustom";
import { requireRules } from "~/constants/defaultValue";
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
  const { id: courseId } = useParams();

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
    if (dataItemUpdate) {
      form.setFieldsValue({ ...dataItemUpdate });
    }
  }, [dataItemUpdate]);

  const onValuesChange = (valueChange: any) => {
    const value: any = Object.values(valueChange)[0];
    const key = Object.keys(valueChange)[0];
  };

  const contentType = Form.useWatch("contentType", form);
  const contentSrc = Form.useWatch("contentSrc", form);
  const contentSrcOfficial = Form.useWatch("contentSrcOfficial", form);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 4 }}
      labelAlign="left"
      initialValues={{
        contentType: "document",
        contentSrc: {
          document: "",
          video: "",
          html: "",
        },
        contentSrcOfficial: {
          document: "",
          video: "",
          html: "",
        },
      }}
      onValuesChange={onValuesChange}
    >
      <Form.Item name={"name"} label="Tiêu đề" rules={requireRules}>
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
      <Form.Item
        hidden={contentType !== "html"}
        name={["contentSrc", "html"]}
        label="Tài liệu bản xem trước"
      >
        <Editors />
      </Form.Item>
      <Form.Item
        help="only Pdf"
        hidden={contentType !== "document"}
        name={["contentSrc", "document"]}
        label="Tài liệu bản xem trước"
      >
        <UploadCustom
          accept=".pdf"
          className="fullWidthUpload"
          typeComponent={"document"}
          onHandleChange={(url) => {
            form.setFieldsValue({
              contentSrc: {
                ...contentSrc,
                document: url,
              },
            });
          }}
          resource="course"
          customPath={`/${courseId}/${scheduleId}/${dataItemUpdate?._id}/contentSrc`}
        />
      </Form.Item>
      {contentType === "document" && <PdfPreview src={contentSrc?.document} />}

      <Form.Item
        hidden={contentType !== "video"}
        name={["contentSrc", "video"]}
        label="Tài liệu bản xem trước"
      >
        <UploadCustom
          className="fullWidthUpload"
          typeComponent={"video"}
          onHandleChange={(url) =>
            form.setFieldsValue({
              contentSrc: {
                ...contentSrc,
                video: url,
              },
            })
          }
          resource="course"
          customPath={`/${courseId}/${scheduleId}/${dataItemUpdate?._id}/contentSrc`}
        />
      </Form.Item>
      <Divider />

      <Form.Item
        hidden={contentType !== "html"}
        name={["contentSrcOfficial", "html"]}
        label="Tài liệu bản chính thức"
      >
        <Editors />
      </Form.Item>
      <Form.Item
        help="only Pdf"
        hidden={contentType !== "document"}
        name={["contentSrcOfficial", "document"]}
        label="Tài liệu bản chính thức"
      >
        <UploadCustom
          accept=".pdf"
          className="fullWidthUpload"
          typeComponent={"document"}
          onHandleChange={(url) => {
            form.setFieldsValue({
              contentSrcOfficial: {
                ...contentSrcOfficial,
                document: url,
              },
            });
          }}
          resource="course"
          customPath={`/${courseId}/${scheduleId}/${dataItemUpdate?._id}/contentSrcOfficial`}
        />
      </Form.Item>
      {contentType === "document" && <PdfPreview src={contentSrcOfficial?.document} />}
      <Form.Item
        hidden={contentType !== "video"}
        name={["contentSrcOfficial", "video"]}
        label="Tài liệu bản chính thức"
      >
        <UploadCustom
          className="fullWidthUpload"
          typeComponent={"video"}
          onHandleChange={(url) =>
            form.setFieldsValue({
              contentSrcOfficial: {
                ...contentSrcOfficial,
                video: url,
              },
            })
          }
          resource="course"
          customPath={`/${courseId}/${scheduleId}/${dataItemUpdate?._id}/contentSrcOfficial`}
        />
      </Form.Item>
      <BtnSubmit loading={isSubmitLoading} id={dataItemUpdate} />
    </Form>
  );
}
