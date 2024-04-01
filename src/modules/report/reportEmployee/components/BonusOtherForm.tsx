import { Button, Form, Input, Select } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useCallback, useEffect } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { requireRules } from "~/constants/defaultValue";
import { BonusOtherType } from "../../reportSupplier/reportSupplier.modal";
import { useResetAction, useUpdatePreviewReportEmployee } from "../reportEmployee.hook";
import { SubmitDataUpdatePreview } from "../reportEmployee.modal";
import { get } from "axios";
type propsType = {
    _id? : string,
    bonusOther : BonusOtherType[],
    employeeId: string,
    indexUpdate? : number
};
export default function BonusOtherForm({_id,bonusOther,employeeId,indexUpdate}: propsType): React.JSX.Element {
  useResetAction();
  const [form] = Form.useForm();
  const callBackSubmit = useCallback(() => form.resetFields(),[])
  const [isSubmitLoadingPreview, onPreviewUpdate] =
  useUpdatePreviewReportEmployee(callBackSubmit);
  const onFinish = (values:BonusOtherType) => {
    
    const submitData :SubmitDataUpdatePreview =  {
        _id,
        employeeId,
      
    }
    if(Number.isFinite(indexUpdate)){      
    submitData.bonusOther =  bonusOther.map((item :BonusOtherType,index:number) => index === indexUpdate ? values : item)
    }else{
    submitData.bonusOther =  [...bonusOther,values];
    }
    onPreviewUpdate(submitData);
  };

  useEffect(() => {
    if(Number.isFinite(indexUpdate)){
      const findOne = bonusOther?.find((item : BonusOtherType,index:number) => index === indexUpdate);
      form.setFieldsValue({...findOne})
    }
  },[indexUpdate,bonusOther,form]);

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
        {Number.isFinite(indexUpdate) ? "Cập nhật" :"Thêm"}
      </Button>
    </Form>
  );
}
