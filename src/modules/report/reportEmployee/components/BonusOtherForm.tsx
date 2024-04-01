import { Button, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useCallback } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { requireRules } from "~/constants/defaultValue";
import { BonusOtherType } from "../../reportSupplier/reportSupplier.modal";
import { useUpdatePreviewReportEmployee } from "../reportEmployee.hook";
import { SubmitDataUpdatePreview } from "../reportEmployee.modal";
type propsType = {
    _id? : string,
    bonusOther : BonusOtherType[],
    employeeId: string
};
export default function BonusOtherForm({_id,bonusOther,employeeId}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const callBackSubmit = useCallback(() => form.resetFields(),[])
  const [isSubmitLoadingPreview, onPreviewUpdate] =
  useUpdatePreviewReportEmployee(callBackSubmit);
  const onFinish = (values:BonusOtherType) => {
    const submitData :SubmitDataUpdatePreview =  {
        _id,
        employeeId,
        bonusOther : [...bonusOther,values]
    }
    onPreviewUpdate(submitData)
  };
  return (
    <Form initialValues={{
        mathMethod : 1
    }} onFinish={onFinish} form={form} layout="inline">
      <Form.Item name="content" label="Nội dung"  rules={requireRules}>
        <TextArea rows={1}/>
      </Form.Item>
      <Form.Item name="value" label="Giá trị" rules={requireRules}>
        <InputNumberAnt min={0} style={{width : '100%'}}/>
      </Form.Item>
      <Form.Item name="mathMethod" label="Loại">
        <Select
          options={[
            {
              value: 1,
              label: "Thưởng",
            },
            {
              value: -1,
              label: "Phạt",
            },
          ]}
        />
      </Form.Item>
      <Button loading={isSubmitLoadingPreview} type="primary"  htmlType="submit" shape="round">
        Thêm
      </Button>
    </Form>
  );
}
