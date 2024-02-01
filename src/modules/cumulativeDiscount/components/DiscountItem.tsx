import { CloseSquareTwoTone, EditTwoTone, EyeTwoTone } from "@ant-design/icons";
import {
  AutoComplete,
  Button,
  Col,
  ConfigProvider,
  DatePicker,
  Divider,
  Form,
  Input,
  Popconfirm,
  Radio,
  Row,
  Segmented,
  Select,
  Space,
  Switch,
  Tooltip,
} from "antd";
import ButtonGroup from "antd/es/button/button-group";
import dayjs from "dayjs";
import { get, keys } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import RenderLoading from "~/components/common/RenderLoading";
import {
  TARGET,
  TYPE_DISCOUNT,
  TYPE_DISCOUNT_VI,
  TYPE_REWARD,
  TYPE_REWARD_VI,
  TYPE_VALUE,
} from "../constants";
import ApplyTimeSheet from "./ApplyTimeSheet";
import CumulativeTimeSheet from "./CumulativeTimeSheet";
import DiscountView from "./DiscountView";
import ItemRewardName from "./ItemRewardName";
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
  supplierId?: string;
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
  supplierId,
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
  const variants = Form.useWatch("variants", form);
  const applyVariantId = get(Form.useWatch(`cumulativeDiscount`, form), [
    name,
    "applyVariantId",
  ]);
  const cumulativeDiscount = Form.useWatch("cumulativeDiscount", form);

  const typeDiscount = Form.useWatch(
    ["cumulativeDiscount", name, "typeDiscount"],
    form
  );

  useEffect(() => {
    setIsSelectUnit(!!applyVariantId);
  }, [applyVariantId]);

  const changeForm = (name: number, value: any) => {
    const newCumulativeDiscount = cumulativeDiscount?.map(
      (item: any, index: number) =>
        index === name
          ? {
              ...item,
              ...value,
            }
          : item
    );

    form.setFieldsValue({
      cumulativeDiscount: newCumulativeDiscount,
    });
  };
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
                typeRepeat: value,
              },
              applyTimeSheet: {
                ...item?.applyTimeSheet,
                repeat: null,
                nonRepeat: null,
                typeRepeat: value,
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
              <Popconfirm
                title="Xác nhận xoá"
                okText="Xoá"
                cancelText="Huỷ"
                onConfirm={() => remove(name)}
              >
                <Button
                  icon={
                    <CloseSquareTwoTone
                      twoToneColor={"red"}
                      style={{ fontSize: 18 }}
                    />
                  }
                />
              </Popconfirm>
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
          name={name}
          isSameTarget={isSameTarget}
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
                <Col lg={24} md={24} sm={24}>
                  <BaseBorderBox title={"Giá trị chiết khấu"}>
                    <Row>
                      <Col span={8}>
                        <Form.Item shouldUpdate noStyle>
                          {() =>
                            [
                              TYPE_DISCOUNT.LK,
                              TYPE_DISCOUNT["DISCOUNT.SOFT.CONDITION"],
                            ].includes(
                              form.getFieldValue([
                                "cumulativeDiscount",
                                name,
                                "typeDiscount",
                              ])
                            ) && (
                              <Form.Item
                                {...restField}
                                label={"Loại thưởng"}
                                name={[name, "typeReward"]}
                                labelCol={{ span: 8 }}
                              >
                                {RenderLoading(
                                  loading,
                                  <Radio.Group
                                    size="small"
                                    options={optionsTypeReward}
                                    optionType="button"
                                    buttonStyle="solid"
                                    onChange={(e) =>
                                      changeForm(name, {
                                        value: null,
                                        itemReward: null,
                                        typeReward: e.target.value,
                                      })
                                    }
                                  />
                                )}
                              </Form.Item>
                            )
                          }
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
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
                                labelCol={{ span: 6 }}
                                wrapperCol={{ span: 20 }}
                              >
                                {RenderLoading(
                                  loading,
                                  <InputNumberAnt
                                    min={0}
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
                    <Form.Item shouldUpdate noStyle>
                      {({ getFieldValue }) =>
                        getFieldValue([
                          "cumulativeDiscount",
                          name,
                          "typeReward",
                        ]) === TYPE_REWARD.PRODUCT && (
                          <>
                            <Row gutter={16}>
                              <Col span={8}>
                                <ItemRewardName
                                  supplierId={supplierId}
                                  form={form}
                                  cumulativeDiscount={cumulativeDiscount}
                                  name={name}
                                />
                              </Col>
                              <Col span={6}>
                                <Form.Item
                                  label="Số lượng"
                                  name={[name, "itemReward", "quantity"]}
                                  rules={[
                                    {
                                      required: true,
                                      message: "Vui lòng nhập",
                                    },
                                  ]}
                                >
                                  <InputNumberAnt />
                                </Form.Item>
                              </Col>
                            </Row>
                          </>
                        )
                      }
                    </Form.Item>

                    <Row>
                      <Col>
                        <Form.Item
                          label="Số lần nhận thưởng"
                          name={[name, "timesReward"]}
                          labelCol={{ span: 11 }}
                        >
                          <Segmented
                            options={[
                              {
                                label: "Một lần",
                                value: 1,
                              },
                              {
                                label: "Nhiều lần",
                                value: Infinity,
                              },
                            ]}
                          />
                        </Form.Item>
                      </Col>
                    </Row>
                  </BaseBorderBox>
                </Col>
                {/* Điều kiện */}
                <Col flex={1}>
                  <Form.Item shouldUpdate noStyle>
                    {() =>
                      [
                        TYPE_DISCOUNT.LK,
                        TYPE_DISCOUNT["DISCOUNT.SOFT.CONDITION"],
                      ].includes(
                        form.getFieldValue([
                          "cumulativeDiscount",
                          name,
                          "typeDiscount",
                        ])
                      ) && (
                        <BaseBorderBox title={"Điều kiện"}>
                          <Divider orientation="left">
                            <h6>Giá trị tích luỹ</h6>
                          </Divider>
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
                                  <InputNumberAnt
                                    min={0}
                                    {...(!form.getFieldValue([
                                      "cumulativeDiscount",
                                      name,
                                      "applyVariantId",
                                    ]) && { addonAfter: <div>VNĐ</div> })}
                                  />
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={7}>
                              <Form.Item shouldUpdate noStyle>
                                {({ getFieldValue }) => (
                                  <Form.Item
                                    colon={false}
                                    style={{ marginBottom: 0 }}
                                    {...restField}
                                    label={"Đến"}
                                    name={[name, "condition", "lte"]}
                                    rules={[
                                      ({ getFieldValue }) => ({
                                        validator(_, value) {
                                          const gte = getFieldValue([
                                            "cumulativeDiscount",
                                            name,
                                            "condition",
                                            "gte",
                                          ]);
                                          if (!value || value >= gte) {
                                            return Promise.resolve();
                                          }
                                          return Promise.reject(
                                            "Phải lớn hơn giá trị bắt đầu"
                                          );
                                        },
                                      }),
                                    ]}
                                  >
                                    {RenderLoading(
                                      loading,
                                      <InputNumberAnt
                                        min={0}
                                        {...(!getFieldValue([
                                          "cumulativeDiscount",
                                          name,
                                          "applyVariantId",
                                        ]) && { addonAfter: <div>VNĐ</div> })}
                                      />
                                    )}
                                  </Form.Item>
                                )}
                              </Form.Item>
                            </Col>
                            <Col span={7}>
                              {isSelectUnit ? (
                                <Form.Item
                                  style={{ marginBottom: 0 }}
                                  {...restField}
                                  label={"Đơn vị"}
                                  name={[name, "applyVariantId"]}
                                >
                                  {RenderLoading(
                                    loading,
                                    <Select
                                      allowClear
                                      // Always Get Unit from Variants Selected and Validate them
                                      options={variants
                                        ?.filter(
                                          (variant: any) =>
                                            !!get(variant, "_id")
                                        )
                                        ?.map((item: any) => ({
                                          label: get(item, "unit.name"),
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
                              <Tooltip
                                title={
                                  target === TARGET.supplier &&
                                  "Nhà cung cấp chỉ được phép chọn VNĐ"
                                }
                              >
                                <Switch
                                  disabled={target === TARGET.supplier}
                                  value={isSelectUnit}
                                  onChange={(checked) => {
                                    if (!checked) {
                                      changeForm(name, {
                                        applyVariantId: null,
                                      });
                                    }
                                    setIsSelectUnit(checked);
                                  }}
                                  unCheckedChildren="VND"
                                  checkedChildren="Đơn vị"
                                />
                              </Tooltip>
                            </Col>
                          </Row>
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
                                style={{ marginBottom: 0, marginTop: 20 }}
                                {...restField}
                                label={"Loại chương trình"}
                                name={[
                                  name,
                                  "cumulativeTimeSheet",
                                  "typeRepeat",
                                ]}
                                tooltip={
                                  <div>
                                    <p>
                                      Không lặp lại: Chỉ xảy ra ở một khoảng
                                      thời gian cố định và không tái diễn
                                    </p>
                                    <p>
                                      Khoảng ngày lặp lại: Xảy ra ở một khoảng
                                      ngày cốt định và được lặp lại hằng tháng
                                    </p>
                                    <p>
                                      Tháng: Lặp theo mỗi tháng mỗi chu kì gồm
                                      đầu tháng đến cuối tháng
                                    </p>
                                    <p>
                                      Quý: Lặp theo mỗi quý mỗi chu kì gồm đầu
                                      quý đến cuối quý
                                    </p>
                                  </div>
                                }
                              >
                                <Segmented
                                  options={options}
                                  onChange={onChangeType}
                                />
                              </Form.Item>
                            </ConfigProvider>
                          </Space>
                        {typeDiscount === TYPE_DISCOUNT.LK &&  
                        <>
                        <Divider orientation="left">
                            <h6> Thời gian tích luỹ</h6>
                          </Divider>
                          <CumulativeTimeSheet
                            form={form}
                            loading={loading}
                            name={name}
                            restField={restField}
                          />
                        </>}
                          <Divider orientation="left">
                            <h6> Thời gian áp dụng</h6>
                          </Divider>
                          <ApplyTimeSheet
                            form={form}
                            name={name}
                            loading={loading}
                            restField={restField}
                          />
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
