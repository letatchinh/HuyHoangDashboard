import { Button, Col, Form, Input, Row, Select, Spin, Tag } from "antd";
import React, { useEffect, useRef, useState } from "react";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { useTags } from "~/utils/hook";
import { TweenOneGroup } from "rc-tween-one";
import { PlusOutlined } from "@ant-design/icons";
import {
  NEW_BILL_EMAIL,
  NEW_QUOTATION_EMAIL,
  STATUS_BILL_EMAIL,
} from "~/constants/defaultValue";
import Breadcrumb from "~/components/common/Breadcrumb";
import {
  useBotNotificationQueryParams,
  useGetBotNotifications,
  useUpdateBotNotification,
} from "../botNotification.hook";

const FormItem = Form.Item;
const { Option } = Select;
const TagFormFragment = ({ form, tagInputName, defaultValue }: any) => {
  const canCreate = useMatchPolicy(POLICIES.WRITE_NOTIFICATIONBOTMANAGER);
  const canDelete = useMatchPolicy(POLICIES.DELETE_NOTIFICATIONBOTMANAGER);
  const [tags, setTags] = useTags(defaultValue);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<any>(null);
  // const ref = useRef<any>(null);
  useEffect(() => {
    if (inputVisible) {
      inputRef.current?.focus();
    }
  }, []);
  useEffect(() => {
    setTags(defaultValue);
  }, [defaultValue]);
  const handleClose = (removedTag: string) => {
    const newTags = tags.filter((tag: string) => tag !== removedTag);
    console.log(newTags);
    setTags(newTags);
    form.setFieldsValue({
      [tagInputName]: newTags,
    });
  };

  const showInput = () => {
    setInputVisible(true);
    if (inputRef.current) {
      inputRef?.current?.focus();
    }
  };

  const handleInputChange = (e: any) => {
    setInputValue(e.target.value);
  };

  const handleInputConfirm = () => {
    if (inputValue && tags.indexOf(inputValue) === -1) {
      const newTags = [...tags, inputValue];
      setTags(newTags);
      form.setFieldsValue({
        [tagInputName]: newTags,
      });
    }

    setInputVisible(false);
    setInputValue("");
  };

  const forMap = (tag: string) => {
    const tagElem = (
      <Tag
        closable={canDelete}
        onClose={(e) => {
          e.preventDefault();
          handleClose(tag);
        }}
      >
        {tag}
      </Tag>
    );
    return (
      <span
        key={tag}
        style={{
          display: "inline-block",
        }}
      >
        {tagElem}
      </span>
    );
  };

  const tagChild = tags.map(forMap);
  return (
    <>
      <div style={{ display: "flex" }}>
        <div>
          <TweenOneGroup
            enter={{
              scale: 0.8,
              opacity: 0,
              type: "from",
              duration: 100,
            }}
            onEnd={(e: any) => {
              if (e.type === "appear" || e.type === "enter") {
                e.target.style = "display: inline-block";
              }
            }}
            leave={{
              opacity: 0,
              width: 0,
              scale: 0,
              duration: 200,
            }}
            appear={false}
          >
            {tagChild}
          </TweenOneGroup>
        </div>
        {inputVisible && (
          <Input
            ref={inputRef}
            autoFocus
            type="text"
            size="small"
            style={{
              minWidth: 50,
              maxWidth: 200,
            }}
            value={inputValue}
            onChange={handleInputChange}
            onBlur={handleInputConfirm}
            onPressEnter={handleInputConfirm}
          />
        )}
        {canCreate
          ? !inputVisible && (
              <Tag
                onClick={() => {
                  showInput();
                }}
                style={{ cursor: "pointer" }}
                className="site-tag-plus"
              >
                <PlusOutlined />{" "}
                <span style={{ marginLeft: "5px", display: "inline-block" }}>
                  Thêm
                </span>
              </Tag>
            )
          : null}
      </div>
    </>
  );
};

const EmailBotManagement = ({ form, data }: any) => {
  return (
    <>
      <FormItem label={<p>Đơn hàng mới</p>} name={NEW_BILL_EMAIL}>
        <TagFormFragment
          form={form}
          defaultValue={data[NEW_BILL_EMAIL]}
          tagInputName={NEW_BILL_EMAIL}
        />
      </FormItem>

      <FormItem label={<p>Trạng thái đơn hàng</p>} name={STATUS_BILL_EMAIL}>
        <TagFormFragment
          form={form}
          defaultValue={data[STATUS_BILL_EMAIL]}
          tagInputName={STATUS_BILL_EMAIL}
        />
      </FormItem>

      <FormItem label={<p>Đơn hàng tạm</p>} name={NEW_QUOTATION_EMAIL}>
        <TagFormFragment
          form={form}
          defaultValue={data[NEW_QUOTATION_EMAIL]}
          tagInputName={NEW_QUOTATION_EMAIL}
        />
      </FormItem>
    </>
  );
};

type propsType = {};
export default function BotNotification(props: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const [selected, setSelected] = useState("emailOption");
  const [query] = useBotNotificationQueryParams();
  const [data, isGetLoading] = useGetBotNotifications(query);
  const [isUpdateLoading, updateBotNotification] = useUpdateBotNotification();

  const onSubmit = (values: any) => {
    updateBotNotification(values);
  };
  const handleChange = (value: any) => {
    setSelected(value);
  };
  return (
    <div className="page-wrapper page-content">
      <Breadcrumb title="Quản lý thông báo tự động" />
      <div className="container-fluid" style={{backgroundColor: '#FFFFFF', padding: '2%'}}>
        <Row justify="space-between">
          <Col>
            <h5>Tài khoản Email nhận thông báo</h5>
          </Col>
          {/* <Col>
            <Select
              value={selected}
              style={{ width: 120 }}
              onChange={handleChange}
            >
              <Option value="emailOption">Email</Option>
            </Select>
          </Col> */}
        </Row>

        <Form
          form={form}
          autoComplete="off"
          onFinish={onSubmit}
          scrollToFirstError
          requiredMark={false}
          labelCol={{ sm: 24, md: 5, lg: 4 }}
          wrapperCol={{ sm: 24, md: 19, lg: 20 }}
        >
          <EmailBotManagement data={data} form={form} />

          <Button
            onClick={() => {
              form.submit();
            }}
            style={{ backgroundColor: "#3481FF", color: "white", marginLeft: '30%' }}
          >
            {isUpdateLoading && <Spin size="large" />}Cập nhật
          </Button>
        </Form>
      </div>
    </div>
  );
}
