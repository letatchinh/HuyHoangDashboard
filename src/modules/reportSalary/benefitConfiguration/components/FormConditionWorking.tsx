import { Button, Flex, Form } from "antd";
import { get } from "lodash";
import React, { useCallback, useEffect } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { requireRules } from "~/constants/defaultValue";
import { useCreateCondition, useDeleteCondition, useResetAction, useUpdateCondition } from "../benefitConfiguration.hook";
import useBenefitConfigStore from "../store/BenefitConfigContext";
type propsType = {
    onCancel?: () => void;
    id?: any;
    initData?: any;
};
export default function FormConditionWorking({onCancel,id,initData}: propsType): React.JSX.Element {
    const {typeBenefit} = useBenefitConfigStore();
    useResetAction();
    const onCallBack = useCallback(() => {
        onCancel && onCancel();
    },[]);
    const [isSubmitLoading,createCondition] = useCreateCondition(onCallBack);
    const [,updateCondition] = useUpdateCondition(onCallBack);
    const [,deleteCondition] = useDeleteCondition(onCallBack);


  const [form] = Form.useForm();
  const onFinish = (values: any) => {
        const submitData = {
        ...values,
        cond : {
            ...values?.cond,
            isRanger : false
        }
      };
    if(id){
        updateCondition({
            ...submitData,
            _id:id
        })
    }else{
        createCondition(submitData);

    }
  };
  const onValueChange = (value: any, values: any) => {
    
  };
  useEffect(() => {
    form.setFieldsValue({
        typeBenefit,
        ...initData
    });
  },[typeBenefit,initData]);
  return (
    <Form layout="inline" onValuesChange={onValueChange} form={form} onFinish={onFinish}>
      <Form.Item name={"typeBenefit"} hidden />
      <Form.Item name={["cond", "gte"]} label="Số ngày trở lên phát sinh đơn hàng liên tục" rules={requireRules}>
        <InputNumberAnt />
      </Form.Item>
      <Form.Item name={["cond", "subCond"]} label="Đơn hàng min từ" rules={requireRules}>
        <InputNumberAnt />
      </Form.Item>
      <Flex gap={10}>
      <Button loading={isSubmitLoading} type="primary" htmlType="submit">
        {id ? "Cập nhật" : "Tạo"}
      </Button>
      {id ? <Button loading={isSubmitLoading} onClick={() => deleteCondition({id})} type="primary" danger>
        Xoá Điều kiện
      </Button> : null}
      </Flex>
    </Form>
  );
}
