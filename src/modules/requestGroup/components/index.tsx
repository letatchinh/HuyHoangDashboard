import { ArrowRightOutlined } from "@ant-design/icons";
import {
  Avatar,
  Button,
  Checkbox,
  Col,
  Flex,
  Form,
  Row,
  Select,
  Typography,
} from "antd";
import { get } from "lodash";
import React, { useState } from "react";
import SelectAnt from "~/components/Antd/SelectAnt";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import SearchList from "~/components/common/SearchList";
import { ChangeGroupSubmitType } from "../requestGroup.modal";
import { RequestGroupProvider } from "../RequestGroupProvider";
import CreateRequest from "./CreateRequest";
import ViewRequest from "./ViewRequest";
type propsType = {};
function CreateAndView(props: propsType): React.JSX.Element {
  return (
    <RequestGroupProvider>
      <Row gutter={8} justify={"space-between"}>
        <Col lg={{ flex: 1 }} md={24}>
          <BaseBorderBox title={"Lịch sử yêu cầu"}>
            <ViewRequest />
          </BaseBorderBox>
        </Col>
        <Col lg={{ flex: 1 }} md={24}>
          <BaseBorderBox title={"Tạo yêu cầu"}>
            <CreateRequest />
          </BaseBorderBox>
        </Col>
      </Row>
    </RequestGroupProvider>
  );
}
const optionRequest = [
  {
    label: "Chuyển tất cả thành viên trong nhóm hiện tại sang nhóm muốn chuyển",
    value: "group",
  },
];
function ControlChangeGroup(props: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const [dataSource,setDataSource] = useState();
  const [dataTarget,setDataTarget] = useState();
  const optionsSource : any[] = [{
    _id : 123,
  }];
  const optionsTarget : any[] = [];
  const onFinish = (values: ChangeGroupSubmitType) => {
    console.log(values,'values');
    
  };
  const onValuesChange = (change: Partial<ChangeGroupSubmitType>, allValue: ChangeGroupSubmitType) => {
    if(change?.requestId){
      // Set Data Source
      const requestInSource = optionsSource?.find((value: any) => get(value,'_id') === change.requestId)
      setDataSource(requestInSource);
    };
    if(change?.targetGroupId){
      // Set Data Target
      const requestInTarget = optionsTarget?.find((value: any) => get(value,'_id') === change.targetGroupId)
      setDataTarget(requestInTarget);
    }
  };
  return (
    <Form
      form={form}
      onValuesChange={onValuesChange}
      onFinish={onFinish}
      className="changeGroup"
    >
      <Row justify={"space-between"} gutter={12}>
        <Col xs={24} lg={11}>
          <h5>Nguồn chuyển</h5>
          <Flex>
            <Form.Item<ChangeGroupSubmitType> noStyle name={"requestId"}>
              <SearchList dataSource={[{label : "YÊU cầu 1",value : 1}]} onChange={(value) => form.setFieldsValue({requestId : value})} onSearch={(value) => {}} />
              {/* <SelectAnt style={{ width: "100%" }} placeholder="Chọn yêu cầu chuyển nhóm" /> */}
            </Form.Item>
          </Flex>
          <div className="changeGroup--description">
            <h6>Thông tin nguồn chuyển</h6>
            <Typography.Paragraph>
              Người muốn chuyển: Lê Tất Chính
            </Typography.Paragraph>
            <Typography.Paragraph>
              Nhóm hiện tại: Nguyễn văn linh
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
            <Form.Item<ChangeGroupSubmitType> noStyle name={"targetGroupId"}>
              <Select
                style={{ width: "100%" }}
                placeholder="Nhóm muốn chuyển"
              />
            </Form.Item>
          </Flex>
          <div className="changeGroup--description">
            <h6>Thông tin nhóm</h6>
            <Typography.Paragraph>
              Thành viên:{" "}
              <Avatar.Group shape="square">
                <Avatar
                  style={{
                    backgroundColor: "#fde3cf",
                  }}
                >
                  A
                </Avatar>
                <Avatar
                  style={{
                    backgroundColor: "#f56a00",
                  }}
                >
                  K
                </Avatar>
                <Avatar
                  style={{
                    backgroundColor: "#87d068",
                  }}
                >
                  C
                </Avatar>
                <Avatar
                  style={{
                    backgroundColor: "#1677ff",
                  }}
                >
                  D
                </Avatar>
              </Avatar.Group>
            </Typography.Paragraph>
          </div>
        </Col>
      </Row>
      <div>
        <h6>Lựa chọn thêm</h6>
        <Form.Item<ChangeGroupSubmitType> noStyle name={"options"}>
          <Checkbox.Group options={optionRequest} />
        </Form.Item>
      </div>
      <Button
        htmlType="submit"
        type="primary"
        style={{ width: 200, marginTop: 10 }}
        icon={<ArrowRightOutlined />}
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
