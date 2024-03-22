import { Button, Col, Form, Input, InputNumber, Row, Switch } from "antd";
import React, { useEffect, useMemo, useState } from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import { STATUS } from "~/constants/defaultValue";
import {
  useConfigurationCronTimeQueryParams,
  useGetConfigurationCronTimes,
  useUpdateConfigurationCronTime,
} from "../configurationCronTime.hook";
import { omit, get } from "lodash";
import { MinusCircleOutlined, PlusOutlined } from "@ant-design/icons";
import { SYSTEM_CRON_TIME_TYPES } from "../constants";

type propsType = {};
const FormItem = Form.Item;
export default function ConfigurationCronTime(
  props: propsType
): React.JSX.Element {
  const [form] = Form.useForm();
  const [formStep] = Form.useForm();
  const [query] = useConfigurationCronTimeQueryParams();
  const [times, isLoading] = useGetConfigurationCronTimes(query);
  const [, updateConfiguration] = useUpdateConfigurationCronTime();

  const [timeDefault, setTimeStepDefault] = useState([]);

  useEffect(() => {
    form.resetFields();
  }, [times, form]);

  const mergedValue = useMemo(() => {
    return times;
  }, [times]);
  const onChangeStatus = (
    _id: any,
    status: any,
    isSubmitLoading: any
    // record: any
  ) => {
    updateConfiguration({
      _id,
      status,
      isSubmitLoading,
    });
  };

  useEffect(() => {
    if (mergedValue) {
      const cronTime = mergedValue;
      form.setFieldsValue(cronTime);
    }
  }, [form, mergedValue]);

  const handleChangeValue = (valuesChange: any, allChanges: any) => {
    timeDefault.map((el) => {
      if (Object.keys(valuesChange)[0] === el) {
        return {
          key: SYSTEM_CRON_TIME_TYPES.CRONJOB_ORDER_SUPPLIER,
          value: valuesChange[Object.keys(valuesChange)[0]],
        };
      } else {
        return el;
      }
    });
  };
  const onFinish = () => {
    if (get(mergedValue, "_id")) {
      updateConfiguration({
        ...mergedValue,
        ...form.getFieldsValue(),
      });
    }
  };
  const layout = {
    labelCol: {
      xs: { span: 48 },
      sm: { span: 12 },
    },
    wrapperCol: {
      xs: { span: 44, offset: 0 },
      sm: { span: 20, offset: 4 },
    },
  };
  return (
    <div>
      <Breadcrumb
        title={"Cấu hình thời gian tự động cho nhà cung cấp"}
      ></Breadcrumb>
      <Row style={{marginBottom: '20px'}}>
        <Col span={4}>
          <h5>Trạng thái cấu hình: </h5>
        </Col>
        <Col span={4}>
          <Switch
            checked={get(times, "status") === "ACTIVE"}
            onChange={(value) =>
              onChangeStatus(
                get(times, "_id"),
                value ? STATUS["ACTIVE"] : STATUS["INACTIVE"],
                isLoading
              )
            }
          />
        </Col>
      </Row>
      <Form
        {...layout}
        form={form}
        onValuesChange={handleChangeValue}
        autoComplete="off"
        scrollToFirstError
        requiredMark={false}
        name="basic"
        labelAlign="left"
       
      >
        <Form.List name="cronTime">
          {(fields, { add, remove }) => (
            <>
              {fields.map((field, index) => (
                <Row
                  key={index}
                  style={{ width: "100%", marginBottom: 8 }}
                  gutter={32}
                >
                  <Col span={10}>
                    <Form.Item
                      label={`Nhập giờ lần ` + (index + 1)}
                      name={[index, "h"]}
                      rules={[
                        {
                          type: "number",
                          min: 0,
                          max: 23,
                          required: true,
                          whitespace: true,
                          message: "Vui lòng nhập giờ từ 0 đến 23",
                        },
                      ]}
                    >
                      <InputNumber defaultValue={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col span={10}>
                    <Form.Item
                      label={`Nhập phút lần ` + (index + 1)}
                      name={[index, "m"]}
                      rules={[
                        {
                          type: "number",
                          min: 0,
                          max: 59,
                          required: true,
                          whitespace: true,
                          message: "Vui lòng nhập phút từ 0 đến 59",
                        },
                      ]}
                    >
                      <InputNumber defaultValue={0} style={{ width: "100%" }} />
                    </Form.Item>
                  </Col>
                  <Col
                    span={4}
                    style={{ alignItems: "center", justifyContent: "center" }}
                  >
                    {fields.length > 1 ? (
                      <MinusCircleOutlined
                        className="dynamic-delete-button"
                        onClick={() => remove(index)}
                      />
                    ) : null}
                  </Col>
                </Row>
              ))}

              <Form.Item>
                <Button
                  type="dashed"
                  onClick={() => add({})}
                  style={{
                    width: "100%",
                    margin: "auto",
                  }}
                  icon={<PlusOutlined />}
                >
                  Thêm giờ/ phút
                </Button>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.Item>
          <Button type="primary" htmlType="submit" onClick={onFinish}>
            {mergedValue ? "Cập nhật" : "Tạo cài đặt"}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
}
