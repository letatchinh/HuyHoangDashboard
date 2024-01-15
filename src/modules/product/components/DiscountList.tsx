import { CloseSquareOutlined, PlusCircleOutlined } from "@ant-design/icons";
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
import dayjs from "dayjs";
import { get, keys } from "lodash";
import React, { useMemo, useState } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import RenderLoading from "~/components/common/RenderLoading";
import { useGetListProductUnitNoParam } from "~/modules/productUnit/productUnit.hook";
import {
  TARGET,
  TYPE_DISCOUNT,
  TYPE_DISCOUNT_VI,
  TYPE_REWARD,
  TYPE_REWARD_VI,
  TYPE_VALUE,
} from "../constants";
import { TypePropsDiscountList } from "../product.modal";
const CLONE_TYPE_DISCOUNT_VI: any = TYPE_DISCOUNT_VI;
const CLONE_TYPE_REWARD_VI: any = TYPE_REWARD_VI;
const defaultValueDiscount = {
  typeDiscount: TYPE_DISCOUNT.CORE,
  valueType: TYPE_VALUE.VALUE,
  typeReward: TYPE_REWARD.VALUE,
  target: TARGET.product,
};
export default function DiscountList({
  product,
  loading,
  form,
}: TypePropsDiscountList): React.JSX.Element {
  const [units, isLoading] = useGetListProductUnitNoParam();
  const [isSelectUnit, setIsSelectUnit] = useState(false);
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

  return (
    <Form.List name={"cumulativeDiscount"}>
      {(fields, { add, remove }) => {
        return (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }: any, index) => (
              <>
                <Form.Item hidden name={[name, "target"]} />
                <Form.Item hidden name={[name, "targetId"]} />
                <Divider orientation="left">Chiết khấu {index + 1}</Divider>
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
                      <Col span={9}>
                        <BaseBorderBox title={"Giá trị chiết khấu"}>
                          <Row>
                            <Col flex={1}>
                              <Form.Item
                                {...restField}
                                label={"Giá trị"}
                                name={[name, "value"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Xin vui nhập!",
                                  },
                                ]}
                              >
                                {RenderLoading(
                                  loading,
                                  <InputNumberAnt
                                    min={0}
                                    style={{ width: "100%" }}
                                  />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={8}>
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
                            </Col>
                          </Row>
                          <Form.Item shouldUpdate noStyle>
                            {() =>
                              form.getFieldValue([
                                "cumulativeDiscount",
                                name,
                                "typeDiscount",
                              ]) !== TYPE_DISCOUNT.CORE && (
                                <Form.Item
                                  style={{ marginBottom: 0 }}
                                  {...restField}
                                  label={"Loại phần thưởng"}
                                  name={[name, "typeReward"]}
                                >
                                  {RenderLoading(
                                    loading,
                                    <Radio.Group
                                      options={optionsTypeReward}
                                      optionType="button"
                                      buttonStyle="solid"
                                    />
                                  )}
                                </Form.Item>
                              )
                            }
                          </Form.Item>
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
                            ]) !== TYPE_DISCOUNT.CORE && (
                              <BaseBorderBox title={"Điều kiện"}>
                                <Row style={{marginBottom : 5}} gutter={8} align={"middle"}>
                                  <Col span={7}>
                                    <Form.Item
                                      style={{ marginBottom: 0 }}
                                      {...restField}
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
                                      style={{ marginBottom: 0 }}
                                      {...restField}
                                      label={"Đến"}
                                      name={[name, "condition", "lte"]}
                                    >
                                      {RenderLoading(
                                        loading,
                                        <InputNumberAnt min={0} />
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
                                            options={units?.map(
                                              (item: any) => ({
                                                label: get(item, "name"),
                                                value: get(item, "_id"),
                                              })
                                            )}
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
                                      onChange={(checked) =>
                                        setIsSelectUnit(checked)
                                      }
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
                                      label={"lặp hàng tháng"}
                                      name={[
                                        name,
                                        "applyTimeSheet",
                                        "isRepeat",
                                      ]}
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
                  <Col span={1}>
                    <CloseSquareOutlined
                      style={{ fontSize: 18, color: "red" }}
                      onClick={() => remove(name)}
                    />
                  </Col>
                </Row>
              </>
            ))}
            <Button
              onClick={() => add(defaultValueDiscount)}
              icon={<PlusCircleOutlined />}
            >
              Thêm chiết khấu
            </Button>
          </>
        );
      }}
    </Form.List>
  );
}
