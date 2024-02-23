import { CheckCircleOutlined, CheckCircleTwoTone, SyncOutlined } from "@ant-design/icons";
import { Button, Col, DatePicker, Form, InputNumber, Modal, Row, Select, Tag } from "antd";
import dayjs from "dayjs";
import { get, range } from "lodash";
import React, { useMemo, useState } from "react";
import RenderLoading from "~/components/common/RenderLoading";
import { TYPE_DISCOUNT } from "../constants";
import { TypeRepeatType } from "../cumulativeDiscount.modal";
import { DiscountFactory } from "../cumulativeDiscount.service";
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
dayjs.extend(isSameOrBefore)
dayjs.extend(isSameOrAfter)
type propsType = {
  form: any;
  name: number;
  restField: any;
  loading: boolean;
};
export default function ApplyTimeSheet({
  form,
  name,
  restField,
  loading,
}: propsType): React.JSX.Element {
  const [isReset,setIsReset] = useState(false);
  const typeRepeat: TypeRepeatType = Form.useWatch(
    ["cumulativeDiscount", name, "typeRepeat"],
    form
  );
  const typeDiscount = Form.useWatch(
    ["cumulativeDiscount", name, "typeDiscount"],
    form
  );
  const applyTimeSheet = form.getFieldValue(['cumulativeDiscount',name,'applyTimeSheet']);
  
  const cumulativeDiscount = Form.useWatch('cumulativeDiscount');
  const getField = (field: string | string[]) => {
    const path = ["cumulativeDiscount", name, "applyTimeSheet"];
    return form.getFieldValue(
      Array.isArray(field) ? path.concat(field) : [...path, field]
    );
  };
  const getFieldCumulative = (field: string | string[]) => {
    const path = ["cumulativeDiscount", name, "cumulativeTimeSheet"];
    return form.getFieldValue(
      Array.isArray(field) ? path.concat(field) : [...path, field]
    );
  };
  const changeForm = (value:any) => {
    
    const newCumulativeDiscount = cumulativeDiscount?.map(
      (item: any, index: number) =>
        index === name
          ? {
              ...item,
              ...value
            }
          : item
    );

    form.setFieldsValue({
      cumulativeDiscount: newCumulativeDiscount,
    });
  };
  const handleConfirmResetSession = () => {
    Modal.confirm({
      title: 'Xác nhận làm mới chương trình sẽ kết thúc chương trình cũ và bắt đầu 1 chương trình mới',
      onOk:handleResetSession
    })
  }
  const handleResetSession = () => {
    const DiscountMethod = new DiscountFactory();
    const newSession = DiscountMethod.generatorSession();
    changeForm({
      applyTimeSheet : {
        ...applyTimeSheet,
        nonRepeat : {
          ...get(applyTimeSheet,'nonRepeat'),
          session:newSession,
        }
      }
    });
    setIsReset(true);
  };
  
  return (
    <Row>
      {/* <Form.Item name={[name, "applyTimeSheet", "typeRepeat"]} hidden /> */}
      {typeRepeat === "nope" && (
        <>
          <Col span={7}>
            <Form.Item
              style={{ marginBottom: 0 }}
              {...restField}
              label={"Từ ngày"}
              name={[name, "applyTimeSheet", "nonRepeat", "gte"]}
              rules={[
                {
                  required: true,
                  message: "Xin vui nhập!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    const gte = getFieldValue([
                      "cumulativeDiscount",
                      name,
                      "cumulativeTimeSheet",
                      "nonRepeat",
                      "lte",
                    ]);
                    const typeDiscount = getFieldValue([
                      "cumulativeDiscount",
                      name,
                      "typeDiscount",
                    ]);
                    if (typeDiscount === TYPE_DISCOUNT.LK && value < gte) {
                      return Promise.reject(
                        "Phải bé hơn ngày tích luỹ kết thúc"
                      );
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              {RenderLoading(
                loading,
                <DatePicker
                  disabledDate={(current) => {
                    const typeDiscount = form.getFieldValue([
                      "cumulativeDiscount",
                      name,
                      "typeDiscount",
                    ]);
                    return typeDiscount === TYPE_DISCOUNT.LK && current < dayjs(getFieldCumulative(["nonRepeat", "lte"]))
                  }
                  }
                  format={"YYYY-MM-DD"}
                />
              )}
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item shouldUpdate noStyle>
              {() => (
                <Form.Item
                  style={{ marginBottom: 0 }}
                  {...restField}
                  label={"Đến ngày"}
                  name={[name, "applyTimeSheet", "nonRepeat", "lte"]}
                  rules={[
                    {
                      required: true,
                      message: "Xin vui nhập!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const gte = getFieldValue([
                          "cumulativeDiscount",
                          name,
                          "applyTimeSheet",
                          "nonRepeat",
                          "gte",
                        ]);
                        
                        if (value < gte) {
                          return Promise.reject("Phải bé hơn ngày bắt đầu");
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  {RenderLoading(
                    loading,
                    <DatePicker
                      disabledDate={(current) =>
                        current <= dayjs(getField(["nonRepeat", "gte"]))
                      }
                      format={"YYYY-MM-DD"}
                    />
                  )}
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          {typeRepeat === "nope" && get(applyTimeSheet,'nonRepeat.session') &&  (
            <Col>
              {isReset ? (
                <Tag
                  icon={<CheckCircleOutlined />}
                  bordered={false}
                  color="success"
                >
                  Đã làm mới
                </Tag>
              ) : (
                <Button
                  onClick={handleConfirmResetSession}
                  type="primary"
                  ghost
                  icon={<SyncOutlined />}
                >
                  Làm mới chương trình
                </Button>
              )}
            </Col>
          )}
        </>
      )}
      {typeDiscount === TYPE_DISCOUNT.LK && ["ranger", "month", "quarter"].includes(typeRepeat) && (
        <>
          <Col span={7}>
            <Form.Item shouldUpdate noStyle>
              {() => (
                <Form.Item
                  style={{ marginBottom: 0 }}
                  {...restField}
                  label={"Từ ngày"}
                  name={[name, "applyTimeSheet", "repeat", "gteRanger"]}
                  rules={[
                    {
                      required: true,
                      message: "Xin vui nhập!",
                    },
                  ]}
                >
                  {RenderLoading(loading, <InputNumber min={1} max={31} />)}
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item shouldUpdate noStyle>
              {() => (
                <Form.Item
                  style={{ marginBottom: 0 }}
                  {...restField}
                  label={"Đến ngày"}
                  name={[name, "applyTimeSheet", "repeat", "lteRanger"]}
                  rules={[
                    {
                      required: true,
                      message: "Xin vui nhập!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const gte = getFieldValue([
                          "cumulativeDiscount",
                          name,
                          "applyTimeSheet",
                          "repeat",
                          "gteRanger",
                        ]);
                        if (
                          ["month", "quarter"].includes(typeRepeat) &&
                          value < gte
                        ) {
                          return Promise.reject(
                            "Phải lớn hơn giá trị ngày bắt đầu"
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  {RenderLoading(loading, <InputNumber min={0} max={31} />)}
                </Form.Item>
              )}
            </Form.Item>
          </Col>
        </>
      )}
      {typeDiscount === TYPE_DISCOUNT.LK && ['year'].includes(typeRepeat) && (
        <>
          <Col span={7}>
            <Form.Item shouldUpdate noStyle>
              {() => (
                <Form.Item
                  style={{ marginBottom: 0 }}
                  {...restField}
                  label={"Từ ngày"}
                  name={[name, "applyTimeSheet", "nonRepeat", "gte"]}
                  rules={[
                    {
                      required: true,
                      message: "Xin vui nhập!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const yearCumulative = getFieldValue([
                          "cumulativeDiscount",
                          name,
                          "cumulativeTimeSheet",
                          "nonRepeat",
                        ]);
                        if (
                          +dayjs(value).format("YYYY") < yearCumulative
                         ) {
                          return Promise.reject(
                            "Phải lớn hơn Năm tích luỹ"
                          );
                        };
                        const applyLte = getFieldValue([
                          "cumulativeDiscount",
                          name,
                          "applyTimeSheet",
                          "nonRepeat",
                          "lte"
                        ]);
                        
                        if (
                          dayjs(value).isSameOrAfter(dayjs(applyLte))
                         ) {
                          return Promise.reject(
                            "Phải Bé hơn Ngày kết thúc"
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  {RenderLoading(loading, <DatePicker format={'YYYY-MM-DD'}/>)}
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item shouldUpdate noStyle>
              {() => (
                <Form.Item
                  style={{ marginBottom: 0 }}
                  {...restField}
                  label={"Đến ngày"}
                  name={[name, "applyTimeSheet", "nonRepeat", "lte"]}
                  rules={[
                    {
                      required: true,
                      message: "Xin vui nhập!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const applyGte = getFieldValue([
                          "cumulativeDiscount",
                          name,
                          "applyTimeSheet",
                          "nonRepeat",
                          "gte"
                        ]);
                        
                        if (
                          dayjs(value).isSameOrBefore(dayjs(applyGte))
                         ) {
                          return Promise.reject(
                            "Phải Lớn hơn Ngày bắt đầu"
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  {RenderLoading(loading, <DatePicker format={'YYYY-MM-DD'}/>)}
                </Form.Item>
              )}
            </Form.Item>
          </Col>
        </>
      )}
      {typeDiscount === TYPE_DISCOUNT['DISCOUNT.SOFT.CONDITION'] && <>
      {
          {
            nope: (
              <>
              </>
            ),
            noTime: (
              <>
              </>
            ),
            year: (
              <Col span={7}>
              <Form.Item shouldUpdate noStyle>
                {() => (
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    {...restField}
                    label={"Năm áp dụng"}
                    name={[name, "applyTimeSheet", "repeat"]}
                    rules={[
                      {
                        required: true,
                        message: "Xin vui nhập!",
                      },
                    ]}
                  >
                    {RenderLoading(
                      loading,
                      <Select
                        allowClear
                        options={range(dayjs().year(),dayjs().year()+12).map((year => ({
                          label : "Năm " + year,
                          value : year,
                        })))}
                      />
                    )}
                  </Form.Item>
                )}
              </Form.Item>
            </Col>
            ),
            ranger: (
              <>
          <Col span={7}>
            <Form.Item shouldUpdate noStyle>
              {() => (
                <Form.Item
                  style={{ marginBottom: 0 }}
                  {...restField}
                  label={"Từ ngày"}
                  name={[name, "applyTimeSheet", "repeat", "gteRanger"]}
                  rules={[
                    {
                      required: true,
                      message: "Xin vui nhập!",
                    },
                  ]}
                >
                  {RenderLoading(loading, <InputNumber min={1} max={31} />)}
                </Form.Item>
              )}
            </Form.Item>
          </Col>
          <Col span={7}>
            <Form.Item shouldUpdate noStyle>
              {() => (
                <Form.Item
                  style={{ marginBottom: 0 }}
                  {...restField}
                  label={"Đến ngày"}
                  name={[name, "applyTimeSheet", "repeat", "lteRanger"]}
                  rules={[
                    {
                      required: true,
                      message: "Xin vui nhập!",
                    },
                    ({ getFieldValue }) => ({
                      validator(_, value) {
                        const gte = getFieldValue([
                          "cumulativeDiscount",
                          name,
                          "applyTimeSheet",
                          "repeat",
                          "gteRanger",
                        ]);
                        if (
                          ["month", "quarter"].includes(typeRepeat) &&
                          value < gte
                        ) {
                          return Promise.reject(
                            "Phải lớn hơn giá trị ngày bắt đầu"
                          );
                        }
                        return Promise.resolve();
                      },
                    }),
                  ]}
                >
                  {RenderLoading(loading, <InputNumber min={0} max={31} />)}
                </Form.Item>
              )}
            </Form.Item>
          </Col>
        </>
            ),
            month: (
              <Col span={7}>
                <Form.Item shouldUpdate noStyle>
                  {() => (
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Tháng áp dụng"}
                      name={[name, "applyTimeSheet", "repeat"]}
                      rules={[
                        {
                          required: true,
                          message: "Xin vui nhập!",
                        },
                      ]}
                    >
                      {RenderLoading(
                        loading,
                        <Select
                          allowClear
                          mode="multiple"
                          options={[
                            { label: "Tháng 1", value: 1 },
                            { label: "Tháng 2", value: 2 },
                            { label: "Tháng 3", value: 3 },
                            { label: "Tháng 4", value: 4 },
                            { label: "Tháng 5", value: 5 },
                            { label: "Tháng 6", value: 6 },
                            { label: "Tháng 7", value: 7 },
                            { label: "Tháng 8", value: 8 },
                            { label: "Tháng 9", value: 9 },
                            { label: "Tháng 10", value: 10 },
                            { label: "Tháng 11", value: 11 },
                            { label: "Tháng 12", value: 12 },
                          ]}
                        />
                      )}
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>
            ),
            quarter: (
              <Col span={7}>
                <Form.Item shouldUpdate noStyle>
                  {() => (
                    <Form.Item
                      style={{ marginBottom: 0 }}
                      {...restField}
                      label={"Quý áp dụng"}
                      name={[name, "applyTimeSheet", "repeat"]}
                      rules={[
                        {
                          required: true,
                          message: "Xin vui nhập!",
                        },
                      ]}
                    >
                      {RenderLoading(
                        loading,
                        <Select
                          allowClear
                          mode="multiple"
                          options={[
                            { label: "Quý 1", value: 1 },
                            { label: "Quý 2", value: 2 },
                            { label: "Quý 3", value: 3 },
                            { label: "Quý 4", value: 4 },
                          ]}
                        />
                      )}
                    </Form.Item>
                  )}
                </Form.Item>
              </Col>
            ),
          }[typeRepeat]
        }
      </>}
    </Row>
  );
}
