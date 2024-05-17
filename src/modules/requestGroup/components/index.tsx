import { ArrowRightOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Row, Switch, Typography
} from "antd";
import { get, omit } from "lodash";
import React, { useEffect } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import WithOrPermission from "~/components/common/WithOrPermission";
import { requireRules } from "~/constants/defaultValue";
import apis from "~/modules/collaborator/collaborator.api";
import { useGetCollaborator } from "~/modules/collaborator/collaborator.hook";
import SelectCollaborator from "~/modules/collaborator/components/SelectSearch";
import POLICIES from "~/modules/policy/policy.auth";
import { useFetchState } from "~/utils/helpers";
import { STATUS_REQUEST_GROUP } from "../constants";
import { useResetAction } from "../requestGroup.hook";
import { ChangeGroupSubmitType } from "../requestGroup.modal";
import useRequestGroupStore, { RequestGroupProvider } from "../RequestGroupProvider";
import CreateRequest from "./CreateRequest";
import ViewRequest from "./ViewRequest";
type propsType = {
  id? : any,
  showCreate? : boolean,
  mode : 'all' | 'one',
};
function CreateAndView({id,showCreate = true,mode}: propsType): React.JSX.Element {
  useResetAction();
  return (
    <RequestGroupProvider mode={mode} id={id}>
      <Row gutter={8} justify={"space-between"} wrap={false}>
        <Col flex={1} md={24}>
          <BaseBorderBox title={"Lịch sử yêu cầu"}>
            <ViewRequest />
          </BaseBorderBox>
        </Col>
        <WithOrPermission permission={[POLICIES.WRITE_REQUESTCHANGEGROUP,POLICIES.WRITE_REQUESTCHANGEGROUPCTV]}>
        {showCreate && <Col lg={8} md={24}>
          <BaseBorderBox title={"Tạo yêu cầu"}>
            <CreateRequest />
          </BaseBorderBox>
        </Col>}
        </WithOrPermission>
      </Row>
    </RequestGroupProvider>
  );
}
type propsTypeControlChangeGroup = {
  requestId? : any,
};
function ControlChangeGroup({requestId}: propsTypeControlChangeGroup): React.JSX.Element {
  const {onUpdateStatus,id,isSubmitLoading} = useRequestGroupStore();
  const [form] = Form.useForm();
  const [partner,isLoading] = useGetCollaborator(id);
  const partnerSelectId = Form.useWatch(['after','groupId'],form);
  
  const [partnerSelect,loading] = useFetchState({api : apis.getById,query : partnerSelectId,useDocs : false,shouldRun : !!partnerSelectId && partnerSelectId !== 'null'});
  
  const onFinish = (values: ChangeGroupSubmitType) => {
    if(values.after.groupId === 'null'){
      onUpdateStatus({
        ...values,
        after : undefined,
        // ...omit(values,['after']),
        status : STATUS_REQUEST_GROUP.COMPLETED
      });
    }else{
      onUpdateStatus({
        ...values,
        status : STATUS_REQUEST_GROUP.COMPLETED
      });
    }
    
  };
  const onValuesChange = (change: Partial<ChangeGroupSubmitType>, allValue: ChangeGroupSubmitType) => {
    if(change.after?.groupId){
      if(change.after?.groupId === 'null'){
        form.setFieldsValue({
          after : {
            groupId : 'null'
          }
        })
      }else{
        form.setFieldsValue({
          after : {
            group : change.after?.groupId,
            groupId : change.after?.groupId,
            groupRef : 'partner',
          }
        })
      }
    }
  };
  
  useEffect(() => {
    form.setFieldsValue({
      _id : requestId,
        before : {
          group : get(partner,'_id'),
          groupId : get(partner,'_id'),
          groupRef : 'partner',
        }
    })
  },[requestId,partner]);
  return (
    <Form
      form={form}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
      className="changeGroup"
      initialValues={{
        isRequestTeam : true
      }}
    >
      <Row justify={"space-between"} gutter={12}>
        <Col xs={24} lg={11}>
          <h5>Nguồn chuyển</h5>
          <Flex>
            <Form.Item noStyle hidden name={"_id"} />
            <Form.Item noStyle hidden name={["before","group"]} />
            <Form.Item noStyle hidden name={["before","groupRef"]} />
            <Form.Item noStyle hidden name={["before","groupId"]} />
              <div style={{height : 30}}></div>
          </Flex>
          <div className="changeGroup--description">
            <h6>Thông tin nguồn chuyển</h6>
            <Typography.Paragraph>
              Người muốn chuyển: <Typography.Text strong>{get(partner,'fullName','')}</Typography.Text>
            </Typography.Paragraph>
            <Typography.Paragraph>
              Nhóm hiện tại: <Typography.Text strong>{get(partner,'parent.fullName','')}</Typography.Text>
            </Typography.Paragraph>
          </div>
        </Col>
        <Col span={1}>
          <Flex justify={"center"}>
            <ArrowRightOutlined />
          </Flex>
        </Col>
        <Col xs={24} lg={11}>
          <h5>Mục tiêu chuyển</h5>
          <Flex>
            <Form.Item noStyle name={['after','group']}/>
            <Form.Item noStyle name={['after','groupRef']}/>
            <Form.Item rules={requireRules} noStyle name={['after','groupId']}>
              <SelectCollaborator mergeOption={[
                {
                  label : "Rời nhóm hiện tại",
                  value : 'null',
                  
                }
              ]} placeholder="Nhóm muốn chuyển"/>
            </Form.Item>
          </Flex>
          <div className="changeGroup--description">
            <h6>Thông tin nhóm</h6>
            {(partnerSelectId && partnerSelectId !== 'null') && <Typography.Paragraph>
              Số điện thoại:{" "} <Typography.Text strong>{get(partnerSelect,'phoneNumber','')}</Typography.Text>
            </Typography.Paragraph>}
          </div>
        </Col>
      </Row>
      <div>
        <h6>Lựa chọn thêm</h6>
        <Form.Item<ChangeGroupSubmitType>  valuePropName="checked" noStyle name={"isRequestTeam"}>
          <Checkbox >Chuyển tất cả thành viên trong nhóm hiện tại sang nhóm muốn chuyển</Checkbox>
        </Form.Item>
      </div>
      <Button
        htmlType="submit"
        type="primary"
        style={{ width: 200, marginTop: 10 }}
        icon={<ArrowRightOutlined />}
        loading={isSubmitLoading}
      >
        Chuyển đổi
      </Button>
    </Form>
  );
}

export default {
  CreateAndView,
  ControlChangeGroup,
};
