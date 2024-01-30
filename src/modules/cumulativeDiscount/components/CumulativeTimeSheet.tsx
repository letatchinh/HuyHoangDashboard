import {
  Col,
  ConfigProvider,
  DatePicker,
  Form,
  InputNumber,
  Row,
  Segmented,
  Select,
  Space,
  Switch,
  Typography,
} from "antd";
import dayjs from "dayjs";
import React, { useState } from "react";
import RenderLoading from "~/components/common/RenderLoading";
import { TypeRepeatType } from "../cumulativeDiscount.modal";
type propsType = {
  name: number;
  loading: boolean;
  form: any;
  restField: any;
};
const options = [
  {
    label: "Không lặp lại",
    value: "nope",
  },
  {
    label: "Khoảng ngày lặp lại",
    value: "ranger",
  },
  {
    label: "Tháng",
    value: "month",
  },
  {
    label: "Quý",
    value: "quarter",
  },
];
export default function CumulativeTimeSheet({
  name,
  loading,
  form,
  restField,
}: propsType): React.JSX.Element {
  // const [valueTypeRepeat, setValueTypeRepeat] =
  //   useState<TypeRepeatType>("nope");
  const cumulativeDiscount = Form.useWatch("cumulativeDiscount", form);
  const typeRepeat: TypeRepeatType = Form.useWatch(
    ["cumulativeDiscount", name, "cumulativeTimeSheet", "typeRepeat"],
    form
  );
  const getField = (field: string | string[]) => {
    const path = [
      "cumulativeDiscount",
      name,
      "cumulativeTimeSheet",
    ]
    return form.getFieldValue(Array.isArray(field) ? path.concat(field) : [...path,field]);
  }
  
  const onChangeType = (value: any) => {
    // setValueTypeRepeat(value);
    // Reset CumulativeTimeSheet And ApplyTimeSheet when change TypeRepeat
    const newCumulativeDiscount = cumulativeDiscount?.map(
      (item: any, index: number) =>
        index === name
          ? {
              ...item,
              cumulativeTimeSheet: {
                ...item?.cumulativeTimeSheet,
                repeat: null,
                nonRepeat: null,
                typeRepeat : value
              },
              applyTimeSheet: {
                ...item?.applyTimeSheet,
                repeat: null,
                nonRepeat: null,
                typeRepeat : value
              },
            }
          : item
    );
            
    form.setFieldsValue({
      cumulativeDiscount: newCumulativeDiscount,
    });
  };
  return (
    <>
      <Space className="mb-3">
        <ConfigProvider
          theme={{
            components: {
              Segmented: {
                itemSelectedBg: "#3481FF",
                itemSelectedColor: "white",
              },
            },
          }}
        >
          <Form.Item
            style={{ marginBottom: 0 }}
            {...restField}
            label={"Loại chương trình"}
            name={[name, "cumulativeTimeSheet", "typeRepeat"]}
            tooltip={<div>
              <p>Không lặp lại: Chỉ xảy ra ở một khoảng thời gian cố định và không tái diễn</p>
              <p>Khoảng ngày lặp lại: Xảy ra ở một khoảng ngày cốt định và được lặp lại hằng tháng</p>
              <p>Tháng: Lặp theo mỗi tháng mỗi chu kì gồm đầu tháng đến cuối tháng</p>
              <p>Quý: Lặp theo mỗi quý mỗi chu kì gồm đầu quý đến cuối quý</p>
            </div>}
          >
            <Segmented
              options={options}
              // value={valueTypeRepeat}
              onChange={onChangeType}
            />
          </Form.Item>
        </ConfigProvider>
      </Space>
      <Row gutter={8} align={"middle"}>
        {
          {
            nope: (
              <>
                <Col span={7}>
                  <Form.Item
                    style={{ marginBottom: 0 }}
                    {...restField}
                    label={"Từ ngày"}
                    name={[name, "cumulativeTimeSheet", "nonRepeat", "gte"]}
                    rules={[
                      {
                        required: true,
                        message: "Xin vui nhập!",
                      },
                    ]}
                  >
                    {RenderLoading(
                      loading,
                      <DatePicker format={"YYYY-MM-DD"} />
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
                        name={[name, "cumulativeTimeSheet", "nonRepeat", "lte"]}
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
                        name={[
                          name,
                          "cumulativeTimeSheet",
                          "repeat",
                          "gteRanger",
                        ]}
                        rules={[
                          {
                            required: true,
                            message: "Xin vui nhập!",
                          },
                        ]}
                      >
                        {RenderLoading(
                          loading,
                          <InputNumber min={1} max={31} />
                        )}
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
                        name={[
                          name,
                          "cumulativeTimeSheet",
                          "repeat",
                          "lteRanger",
                        ]}
                        rules={[
                          {
                            required: true,
                            message: "Xin vui nhập!",
                          },
                        ]}
                      >
                        {RenderLoading(
                          loading,
                          <InputNumber min={0} max={31} />
                        )}
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
                      label={"Chọn tháng lặp"}
                      name={[name, "cumulativeTimeSheet", "repeat"]}
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
                      label={"Chọn quý lặp"}
                      name={[name, "cumulativeTimeSheet", "repeat"]}
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
      </Row>
    </>
  );
}

