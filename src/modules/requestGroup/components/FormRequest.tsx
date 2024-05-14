import { Button, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect } from "react";
import { STATUS_REQUEST_GROUP } from "../constants";
import { RequestGroupSubmitType } from "../requestGroup.modal";
import useRequestGroupStore from "../RequestGroupProvider";
type propsType = {
  initData? : any
};
export default function FormRequest({initData}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const {createRequest,id : requestOfId,isSubmitLoading} = useRequestGroupStore();
  const onFinish = (values: RequestGroupSubmitType) => {
    createRequest(values);
  };
  useEffect(() => {
    if(initData){
      form.setFieldsValue(initData)
    }else{
      form.setFieldsValue({
        requestOfId,
      })
    }
  },[initData,requestOfId])
  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={{ status: STATUS_REQUEST_GROUP.NEW }}
    >
      <Form.Item<RequestGroupSubmitType> name={"status"} hidden />
      <Form.Item<RequestGroupSubmitType> name={"requestOfId"} hidden />
      <Form.Item<RequestGroupSubmitType> name={"contentRequest"}>
        <TextArea rows={4} placeholder="Nhập nội dung yêu cầu!"/>
      </Form.Item>
      <Button loading={isSubmitLoading} block type="primary" htmlType="submit">
        Lưu
      </Button>
    </Form>
  );
}
