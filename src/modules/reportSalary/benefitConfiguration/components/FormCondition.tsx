import { Button, Flex, Form } from "antd";
import { get } from "lodash";
import React, { useCallback, useEffect } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { useCreateCondition, useDeleteCondition, useResetAction, useUpdateCondition } from "../benefitConfiguration.hook";
import { TypeBenefit } from "../benefitConfiguration.modal";
import useBenefitConfigStore from "../store/BenefitConfigContext";
type propsType = {
    typeBenefit? : TypeBenefit | null,
    mutate?: () => void;
    onCancel?: () => void;
    id?: any;
    initData?: any;
};
export default function FormCondition({typeBenefit,mutate,onCancel,id,initData}: propsType): React.JSX.Element {
    useResetAction();
    const onCallBack = useCallback(() => {
        onCancel && onCancel();
        mutate && mutate();
    },[mutate]);
    const [isSubmitLoading,createCondition] = useCreateCondition(onCallBack);
    const [,updateCondition] = useUpdateCondition(onCallBack);
    const [,deleteCondition] = useDeleteCondition(onCallBack);
  const { canUpdateBenefit, canDeleteBenefit } = useBenefitConfigStore();

  const [form] = Form.useForm();
  const onFinish = (values: any) => {
      const { cond } = values;
      const submitData = {
        ...values,
        cond : {
            ...values?.cond,
            isRanger : !!get(cond,'lt')
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
    const { cond } = values;    
    form.setFieldsValue({
      isRanger: !!get(cond,'lt'),
    });
    
  };
  useEffect(() => {
    form.setFieldsValue({
        typeBenefit,
        ...initData
    });
  },[typeBenefit,initData]);
  // if([])
  return (
    <Form layout="inline" onValuesChange={onValueChange} form={form} onFinish={onFinish}>
      <Form.Item name={["cond", "isRanger"]} hidden />
      <Form.Item name={"typeBenefit"} hidden />
      <Form.Item name={["cond", "gte"]} label="Từ">
        <InputNumberAnt />
      </Form.Item>
      <Form.Item name={["cond", "lt"]} label="Đến">
        <InputNumberAnt />
      </Form.Item>
      <Flex gap={10}>
      <Button loading={isSubmitLoading} type="primary" htmlType="submit">
        {id ? "Cập nhật" : "Tạo"}
      </Button>
      {canDeleteBenefit && (id ? <Button loading={isSubmitLoading} onClick={() => deleteCondition({id})} type="primary" danger>
        Xoá Điều kiện
      </Button> : null)}
      </Flex>
    </Form>
  );
}
