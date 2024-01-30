import { Col, DatePicker, Form, InputNumber, Row } from "antd";
import dayjs from "dayjs";
import React, { useMemo } from "react";
import RenderLoading from "~/components/common/RenderLoading";
import { TypeRepeatType } from "../cumulativeDiscount.modal";
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
  const typeRepeat: TypeRepeatType = Form.useWatch(
    ["cumulativeDiscount", name, "cumulativeTimeSheet", "typeRepeat"],
    form
  );
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
  return (
    <Row>
      <Form.Item name={[name, "applyTimeSheet", "typeRepeat"]} hidden />
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
                    if (value < gte) {
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
                  disabledDate={(current) =>
                    current < dayjs(getFieldCumulative(["nonRepeat", "lte"]))
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
                          return Promise.reject(
                            "Phải bé hơn ngày bắt đầu"
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
        </>
      )}
      {["ranger", "month", "quarter"].includes(typeRepeat) && (
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
                        if (['month','quarter'].includes(typeRepeat) && (value < gte)) {
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
    </Row>
  );
}
