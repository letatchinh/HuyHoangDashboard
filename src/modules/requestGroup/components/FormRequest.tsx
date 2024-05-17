import { Button, Form } from "antd";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect } from "react";
import { requireRules } from "~/constants/defaultValue";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import { STATUS_REQUEST_GROUP } from "../constants";
import { useGetCreateRequestGroupSuccess } from "../requestGroup.hook";
import { RequestGroupSubmitType } from "../requestGroup.modal";
import useRequestGroupStore from "../RequestGroupProvider";
type propsType = {
  initData?: any;
};
export default function FormRequest({
  initData,
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const {
    createRequest,
    id: requestOfId,
    isSubmitLoading,
    mode,
  } = useRequestGroupStore();
  
  const createSuccess : any = useGetCreateRequestGroupSuccess();
  const onFinish = (values: RequestGroupSubmitType) => {
    createRequest(values);
  };
  useEffect(() => {
    if (initData) {
      form.setFieldsValue(initData);
    } else {
    if(mode === 'one'){
      form.setFieldsValue({
        requestOfId,
      });
    }
    }
  }, [initData, requestOfId]);

  useEffect(() => {
    form.setFieldsValue({
      contentRequest: "",
    });
    if(mode === 'all'){
      form.setFieldsValue({
        requestOfId: null,
      });
    }
  }, [createSuccess]);

  return (
    <Form
      form={form}
      onFinish={onFinish}
      initialValues={{ status: STATUS_REQUEST_GROUP.NEW }}
    >
      <Form.Item<RequestGroupSubmitType> name={"status"} hidden />
      {mode === "all" && (
        <Form.Item<RequestGroupSubmitType> rules={requireRules} name={"requestOfId"}>
          <SelectCollaborator />
        </Form.Item>
      )}
      {mode === "one" && (
        <Form.Item<RequestGroupSubmitType> name={"requestOfId"} hidden/>
      )}
      <Form.Item<RequestGroupSubmitType>
        name={"contentRequest"}
        rules={requireRules}
      >
        <TextArea rows={4} placeholder="Nhập nội dung yêu cầu!" />
      </Form.Item>
      <Button loading={isSubmitLoading} block type="primary" htmlType="submit">
        Gửi yêu cầu
      </Button>
    </Form>
  );
}
