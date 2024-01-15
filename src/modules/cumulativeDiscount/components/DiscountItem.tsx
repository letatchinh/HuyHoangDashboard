import { CloseSquareTwoTone, EditTwoTone, EyeTwoTone } from "@ant-design/icons";
import {
  Button,
  Col,
  DatePicker,
  Divider,
  Form,
  Input,
  Radio,
  Row,
  Select,
  Switch,
} from "antd";
import ButtonGroup from "antd/es/button/button-group";
import dayjs from "dayjs";
import { get, keys } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import RenderLoading from "~/components/common/RenderLoading";
import {
  TYPE_DISCOUNT,
  TYPE_DISCOUNT_VI,
  TYPE_REWARD,
  TYPE_REWARD_VI,
  TYPE_VALUE,
} from "../constants";
import DiscountView from "./DiscountView";
type propsType = {
  key: any;
  name: number;
  index: number;
  restField: any;
  loading: boolean;
  form: any;
  units: any;
  remove: (v: any) => void;
  target: string;
};
const CLONE_TYPE_DISCOUNT_VI: any = TYPE_DISCOUNT_VI;
const CLONE_TYPE_REWARD_VI: any = TYPE_REWARD_VI;

export default function DiscountItem({
  key,
  name,
  index,
  restField,
  loading,
  form,
  units,
  remove,
  target,
}: propsType): React.JSX.Element {
  const [isSelectUnit, setIsSelectUnit] = useState(false);
  const [editing, setEditing] = useState(true);
  const optionsTypeDiscount = useMemo(
    () =>
      keys(TYPE_DISCOUNT).map((key) => ({
        label: CLONE_TYPE_DISCOUNT_VI[key],
        value: key,
      })),
    []
  );
  const optionsTypeReward = useMemo(
    () =>
      keys(TYPE_REWARD).map((key) => ({
        label: CLONE_TYPE_REWARD_VI[key],
        value: key,
      })),
    []
  );

  const toggleEdit = useCallback(async () => {
    try {
      await form.validateFields();
      setEditing(!editing);
    } catch (error: any) {
      const { errorFields } = error;
      const isErrorDiscount = errorFields?.some(
        (item: any) =>
          get(item, ["name", 0]) === "cumulativeDiscount" &&
          get(item, ["name", 1]) === name
      );
      if (!isErrorDiscount) {
        setEditing(!editing);
      }
    }
  }, [editing, form, name]);
  const isSameTarget = useMemo(
    () =>
      get(form.getFieldValue(["cumulativeDiscount", name]), "target") ===
      target,
    [form, name, target]
  );
  useEffect(() => {
    if (get(form.getFieldValue(["cumulativeDiscount", name]), "_id")) {
      setEditing(false);
    }
  }, [form, name]);
  return (
    <>
      <Divider orientation="left">
        <span>
          Chiết khấu {index + 1} &nbsp;
          {isSameTarget ? (
            <ButtonGroup>
              <Button
                onClick={toggleEdit}
                icon={
                  editing ? (
                    <EyeTwoTone style={{ fontSize: 18 }} />
                  ) : (
                    <EditTwoTone style={{ fontSize: 18 }} />
                  )
                }
              />
              <Button
                onClick={() => remove(name)}
                icon={
                  <CloseSquareTwoTone
                    twoToneColor={"red"}
                    style={{ fontSize: 18 }}
                  />
                }
              />
            </ButtonGroup>
          ) : (
            "(Chiết khấu của nhà cung cấp)"
          )}
        </span>
      </Divider>
      {!editing ? (
        <DiscountView
          data={form.getFieldValue(["cumulativeDiscount", name])}
          units={units}
        />
      ) : (
        <React.Fragment key={key}>
          <Form.Item hidden name={[name, "target"]} />
          <Form.Item hidden name={[name, "targetId"]} />

          <Row wrap={false} justify={"space-between"}>
            <Col flex={1}>
              <Row className="mb-2" gutter={48} key={key} align="middle">
                {/* Thông tin chung */}
                <Col span={24}>
                  <BaseBorderBox title={"Thông tin chung"}>
                    <Row gutter={16}>
                      <Col span={11}>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          {...restField}
                          label={"Tên chiết khấu"}
                          name={[name, "name"]}
                          rules={[
                            {
                              required: true,
                              message: "Xin vui nhập!",
                            },
                          ]}
                        >
                          {RenderLoading(loading, <Input />)}
                        </Form.Item>
                      </Col>
                      <Col span={11}>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          {...restField}
                          label={"Loại chiết khấu"}
                          name={[name, "typeDiscount"]}
                        >
                          {RenderLoading(
                            loading,
                            <Select options={optionsTypeDiscount} />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </BaseBorderBox>
                </Col>
                {/* Giá trị Chiết khấu */}
                <Col lg={10} md={24} sm={24}>
                  <BaseBorderBox title={"Giá trị chiết khấu"}>
                    <Form.Item shouldUpdate noStyle>
                      {() =>
                        form.getFieldValue([
                          "cumulativeDiscount",
                          name,
                          "typeDiscount",
                        ]) === TYPE_DISCOUNT.LK && (
                          <Form.Item
                            style={{ marginBottom: 0 }}
                            {...restField}
                            label={"Loại thưởng"}
                            name={[name, "typeReward"]}
                          >
                            {RenderLoading(
                              loading,
                              <Radio.Group
                                size="small"
                                options={optionsTypeReward}
                                optionType="button"
                                buttonStyle="solid"
                              />
                            )}
                          </Form.Item>
                        )
                      }
                    </Form.Item>
                    <Row>
                      <Col flex={1}>
                        <Form.Item shouldUpdate noStyle>
                          {({ getFieldValue }) =>
                            getFieldValue([
                              "cumulativeDiscount",
                              name,
                              "typeReward",
                            ]) === TYPE_REWARD.VALUE && (
                              <Form.Item
                                {...restField}
                                label={"Giá trị"}
                                name={[name, "value"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Xin vui nhập!",
                                  },
                                  {
                                    type: "number",
                                    max:
                                      form.getFieldValue([
                                        "cumulativeDiscount",
                                        name,
                                        "valueType",
                                      ]) === TYPE_VALUE.PERCENT
                                        ? 100
                                        : Infinity,
                                    message: "Vui lòng nhập bé hơn 100%",
                                  },
                                ]}
                              >
                                {RenderLoading(
                                  loading,
                                  <InputNumberAnt
                                    max={
                                      form.getFieldValue([
                                        "cumulativeDiscount",
                                        name,
                                        "valueType",
                                      ]) === TYPE_VALUE.PERCENT
                                        ? 100
                                        : Infinity
                                    }
                                    style={{ width: "100%" }}
                                  />
                                )}
                              </Form.Item>
                            )
                          }
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item shouldUpdate noStyle>
                          {({ getFieldValue }) =>
                            getFieldValue([
                              "cumulativeDiscount",
                              name,
                              "typeReward",
                            ]) === TYPE_REWARD.VALUE && (
                              <Form.Item
                                {...restField}
                                name={[name, "valueType"]}
                              >
                                {RenderLoading(
                                  loading,
                                  <Radio.Group
                                    size="small"
                                    optionType="button"
                                    buttonStyle="solid"
                                  >
                                    <Radio.Button value="VALUE">
                                      Giá trị
                                    </Radio.Button>
                                    <Radio.Button value="PERCENT">
                                      %
                                    </Radio.Button>
                                  </Radio.Group>
                                )}
                              </Form.Item>
                            )
                          }
                        </Form.Item>
                      </Col>
                    </Row>
                  </BaseBorderBox>
                </Col>
                {/* Điều kiện */}
                <Col flex={1}>
                  <Form.Item shouldUpdate noStyle>
                    {() =>
                      form.getFieldValue([
                        "cumulativeDiscount",
                        name,
                        "typeDiscount",
                      ]) === TYPE_DISCOUNT.LK && (
                        <BaseBorderBox title={"Điều kiện"}>
                          <Row
                            style={{ marginBottom: 5 }}
                            gutter={8}
                            align={"middle"}
                          >
                            <Col span={7}>
                              <Form.Item
                                style={{ marginBottom: 0 }}
                                {...restField}
                                colon={false}
                                label={"Từ"}
                                name={[name, "condition", "gte"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Xin vui nhập!",
                                  },
                                ]}
                              >
                                {RenderLoading(
                                  loading,
                                  <InputNumberAnt min={0} />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={7}>
                              <Form.Item
                              colon={false}
                                style={{ marginBottom: 0 }}
                                {...restField}
                                label={"Đến"}
                                name={[name, "condition", "lte"]}
                                rules={[
                                  {
                                    type: "number",
                                    max:
                                      form.getFieldValue([
                                        "cumulativeDiscount",
                                        name,
                                        "condition",
                                        "gte",
                                      ]),
                                    message: "Vui lòng nhập bé hơn Từ",
                                  },
                                ]}
                              >
                                {RenderLoading(
                                  loading,
                                  <InputNumberAnt min={0} max={form.getFieldValue([
                                    "cumulativeDiscount",
                                    name,
                                    "condition",
                                    "gte",
                                  ])}/>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={7}>
                              {isSelectUnit ? (
                                <Form.Item
                                  style={{ marginBottom: 0 }}
                                  {...restField}
                                  label={"Đơn vị"}
                                  name={[name, "applyUnit"]}
                                >
                                  {RenderLoading(
                                    loading,
                                    <Select
                                      options={units?.map((item: any) => ({
                                        label: get(item, "name"),
                                        value: get(item, "_id"),
                                      }))}
                                    />
                                  )}
                                </Form.Item>
                              ) : (
                                <></>
                              )}
                            </Col>
                            <Col>
                              <Switch
                                value={isSelectUnit}
                                onChange={(checked) => setIsSelectUnit(checked)}
                                unCheckedChildren="VND"
                                checkedChildren="Đơn vị"
                              />
                            </Col>
                          </Row>
                          <Row
                            gutter={8}
                            align={"middle"}
                            justify="space-between"
                          >
                            <Col span={7}>
                              <Form.Item
                                style={{ marginBottom: 0 }}
                                {...restField}
                                label={"Từ ngày"}
                                name={[name, "applyTimeSheet", "gte"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Xin vui nhập!",
                                  },
                                ]}
                              >
                                {RenderLoading(
                                  loading,
                                  <DatePicker
                                    disabledDate={(current) => {
                                      // Can not select days before lte and today
                                      return (
                                        current &&
                                        current < dayjs().endOf("day")
                                      );
                                    }}
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
                                    name={[name, "applyTimeSheet", "lte"]}
                                  >
                                    {RenderLoading(
                                      loading,
                                      <DatePicker
                                        disabledDate={(current) =>
                                          current <=
                                          dayjs(
                                            form.getFieldValue([
                                              "cumulativeDiscount",
                                              name,
                                              "applyTimeSheet",
                                              "gte",
                                            ])
                                          )
                                        }
                                        format={"YYYY-MM-DD"}
                                      />
                                    )}
                                  </Form.Item>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={10}>
                              <Form.Item
                                style={{ marginBottom: 0 }}
                                {...restField}
                                label={"Dùng lại"}
                                name={[name, "applyTimeSheet", "isRepeat"]}
                              >
                                {RenderLoading(loading, <Switch />)}
                              </Form.Item>
                            </Col>
                          </Row>
                        </BaseBorderBox>
                      )
                    }
                  </Form.Item>
                </Col>
              </Row>
            </Col>
          </Row>
        </React.Fragment>
      )}
    </>
  );
}
