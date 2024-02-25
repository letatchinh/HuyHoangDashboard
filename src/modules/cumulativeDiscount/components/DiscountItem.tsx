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
  Tag,
  Tooltip,
} from "antd";
import ButtonGroup from "antd/es/button/button-group";
import dayjs from "dayjs";
import { get, keys } from "lodash";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import BaseBorderBox from "~/components/common/BaseBorderBox/index";
import RenderLoading from "~/components/common/RenderLoading";
import { INFINITY } from "~/constants/defaultValue";
import {
  TARGET,
  TYPE_DISCOUNT,
  TYPE_DISCOUNT_VI,
  TYPE_REPEAT,
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
  targetType: string;
  supplierId?: string;
  editingDefault?:boolean
};
const options = [
  {
    label: "Chiết khấu ngay",
    value: "noTime",
  },
  {
    label: "Ngày",
    value: "nope",
  },
  // {
  //   label: "Khoảng ngày lặp lại",
  //   value: "ranger",
  // },
  {
    label: "Tháng",
    value: "month",
  },
  {
    label: "Quý",
    value: "quarter",
  },
  {
    label: "Năm",
    value: "year",
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
  targetType,
  supplierId,
  editingDefault = true
}: propsType): React.JSX.Element {
  
  const [isSelectUnit, setIsSelectUnit] = useState(false);
  // const [editing, setEditing] = useState(editingDefault);
  
  const optionsTypeReward = useMemo(
    () =>
      keys(TYPE_REWARD).map((key) => ({
        label: CLONE_TYPE_REWARD_VI[key],
        value: key,
      })),
    []
  );


  const isSameTarget = useMemo(
    () =>
      get(form.getFieldValue(["cumulativeDiscount", name]), "target") ===
      target,
    [form, name, target]
  );

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
  const editing = Form.useWatch(
    ["cumulativeDiscount", name, "editing"],
    form
  ) || false;

  const _id = Form.useWatch(
    ["cumulativeDiscount", name, "_id"],
    form
  ) || false;

  const typeRepeat = Form.useWatch(
    ["cumulativeDiscount", name, "typeRepeat"],
    form
  );

  const optionsTypeDiscount = useMemo(
    () =>
      keys(TYPE_DISCOUNT).map((key) => ({
        label: CLONE_TYPE_DISCOUNT_VI[key],
        value: key,
        disabled : 
        (key === 'LK' && [TYPE_REPEAT.noTime,TYPE_REPEAT.nope].includes(typeRepeat)) // Type repeat NoTime And Nope Not Have LK
        || ([TYPE_DISCOUNT["DISCOUNT.CORE"],TYPE_DISCOUNT["DISCOUNT.SOFT"]].includes(key) && typeRepeat !== TYPE_REPEAT.noTime) // TypeDiscount Core,Soft Only have NoTime
        || key !== 'LK' && ![TYPE_REPEAT.noTime,TYPE_REPEAT.nope].includes(typeRepeat) // Type LK Only Diff No Time and Nope
      })),
    [typeRepeat]
  );

  useEffect(() => {
    setIsSelectUnit(!!applyVariantId);
  }, [applyVariantId]);

  const changeForm = (value: any) => {
      
    const newCumulativeDiscount = cumulativeDiscount?.map(
      (item: any, index: number) =>
        index === name
          ? {
              ...item,
              ...value,
            }
          : item
      );
            console.log(cumulativeDiscount,'cumulativeDiscount');
            
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
              typeDiscount: null,
              typeRepeat: value,
              cumulativeTimeSheet: {
                ...item?.cumulativeTimeSheet,
                repeat: null,
                nonRepeat: null,
              },
              applyTimeSheet: {
                ...item?.applyTimeSheet,
                repeat: null,
                nonRepeat: null,
                typeDiscount: null,
              },
            }
          : item
    );

    form.setFieldsValue({
      cumulativeDiscount: newCumulativeDiscount,
    });
  };

  const toggleEdit = async () => {
    try {
      await form.validateFields();
      changeForm({editing : !editing});
    } catch (error: any) {
      const { errorFields } = error;
      const isErrorDiscount = errorFields?.some(
        (item: any) =>
          get(item, ["name", 0]) === "cumulativeDiscount" &&
          get(item, ["name", 1]) === name
      );
      if (!isErrorDiscount) {
        changeForm({editing : !editing});
      }
    }
  }

  // useEffect(() => {
  //   if (get(form.getFieldValue(["cumulativeDiscount", name]), "_id")) {
  //     changeForm({editing : false});
  //   }
  // }, [form, name,]);
  return (
    <>
      <Divider orientation="left">
        <span>
          <Tag color={_id ? 'blue' : 'success'}>{_id ? "Cập nhật" : "Mới"}</Tag>Chiết khấu {index + 1} &nbsp;
          {isSameTarget ? (
            <ButtonGroup>
              <Button
                type="primary"
                onClick={toggleEdit}
                // icon={
                //   editing ? (
                //     <EyeTwoTone style={{ fontSize: 18 }} />
                //   ) : (
                //     <EditTwoTone style={{ fontSize: 18 }} />
                //   )
                // }
              >
                {editing ? "Xem trước" : "Chỉnh sửa"}
              </Button>
              <Popconfirm
                title="Xác nhận xoá"
                okText="Xoá"
                cancelText="Huỷ"
                onConfirm={() => remove(name)}
              >
                <Button
                danger
                type="primary"
                  // icon={
                  //   <CloseSquareTwoTone
                  //     twoToneColor={"red"}
                  //     style={{ fontSize: 18 }}
                  //   />
                  // }
                >
                  Xoá
                </Button>
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
          variants={variants}
          name={name}
          isSameTarget={isSameTarget}
        />
      ) : (
        <React.Fragment key={key}>
          <Form.Item hidden name={[name, "target"]} />
          <Form.Item hidden name={[name, "targetType"]} initialValue={targetType} />
          <Form.Item hidden name={[name, "targetId"]} />

          <Row wrap={false} justify={"space-between"}>
            <Col flex={1}>
              <Row className="mb-2" gutter={48} key={key} align="middle">
                {/* Loại chiết khấu */}
                <Col span={24}>
                  <BaseBorderBox title={"Loại chiết khấu"}>
                    <Row>
                      <Col span={24}>
                        <Form.Item shouldUpdate noStyle>
                          {() => (
                            <Form.Item
                              {...restField}
                              label={"Loại thưởng"}
                              name={[name, "typeReward"]}
                              labelCol={{ span: 4 }}
                            >
                              {RenderLoading(
                                loading,
                                <Radio.Group
                                  size="small"
                                  options={optionsTypeReward}
                                  optionType="button"
                                  buttonStyle="solid"
                                  onChange={(e) =>
                                    changeForm({
                                      value: null,
                                      itemReward: null,
                                      typeReward: e.target.value,
                                    })
                                  }
                                />
                              )}
                            </Form.Item>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={24}>
                        {/* <Space className="mb-3"> */}
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
                              {...restField}
                              label={"Loại chương trình"}
                              name={[name, "typeRepeat"]}
                              labelCol={{ span: 4 }}
                              tooltip={
                                <div>
                                  <p>
                                    Không lặp lại: Chỉ xảy ra ở một khoảng thời
                                    gian cố định và không tái diễn
                                  </p>
                                  <p>
                                    Khoảng ngày lặp lại: Xảy ra ở một khoảng
                                    ngày cốt định và được lặp lại hằng tháng
                                  </p>
                                  <p>
                                    Tháng: Lặp theo mỗi tháng mỗi chu kì gồm đầu
                                    tháng đến cuối tháng
                                  </p>
                                  <p>
                                    Quý: Lặp theo mỗi quý mỗi chu kì gồm đầu quý
                                    đến cuối quý
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
                        {/* </Space> */}
                      </Col>
                      <Col span={24}>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          {...restField}
                          label={"Loại chiết khấu"}
                          name={[name, "typeDiscount"]}
                          labelCol={{ span: 4 }}
                        >
                          {RenderLoading(
                            loading,
                            <Select style={{maxWidth : 200}} options={optionsTypeDiscount} />
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  </BaseBorderBox>
                </Col>
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
                              message: "Xin vui lòng nhập tên chiết khấu!",
                            },
                          ]}
                        >
                          {RenderLoading(loading, <Input />)}
                        </Form.Item>
                      </Col>
                      {/* <Col span={11}>
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
                      </Col> */}
                    </Row>
                  </BaseBorderBox>
                </Col>
                {/* Giá trị Chiết khấu */}
                <Col lg={24} md={24} sm={24}>
                  <BaseBorderBox title={"Giá trị chiết khấu"}>
                    {/* <Row>
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
                    </Row> */}
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
                          {({ getFieldValue,setFieldValue }) =>
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
                                    onChange={(e) => {
                                      // TODO: valueType = PERCENT WILL set timesReward INFINITE
                                      if(e.target.value === 'PERCENT'){
                                        setFieldValue(
                                          [
                                            "cumulativeDiscount",
                                            name,
                                            "timesReward",
                                          ],
                                          INFINITY
                                        )
                                      }
                                    }}
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
                                  <InputNumberAnt min={1} />
                                </Form.Item>
                              </Col>
                            </Row>
                          </>
                        )
                      }
                    </Form.Item>

                    {typeDiscount !== TYPE_DISCOUNT.LK && (
                      <Row>
                        <Col>
                          <Form.Item
                            label="Số lần nhận thưởng"
                            name={[name, "timesReward"]}
                            labelCol={{ span: 11 }}
                            hidden
                          />
                          <span>Số lần nhận thưởng: </span>
                          <Form.Item shouldUpdate noStyle>
                            {() => (
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
                                <Segmented
                                  onChange={(value) =>
                                    changeForm({
                                      timesReward: value,
                                    })
                                  }
                                  value={form.getFieldValue([
                                    "cumulativeDiscount",
                                    name,
                                    "timesReward",
                                  ])}
                                  options={[
                                    {
                                      label: "Một lần",
                                      value: 1,
                                    },
                                    {
                                      label: "Nhiều lần",
                                      value: INFINITY,
                                    },
                                  ]}
                                />
                              </ConfigProvider>
                            )}
                          </Form.Item>
                          {/* </Form.Item> */}
                        </Col>
                      </Row>
                    )}
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
                            {typeDiscount === TYPE_DISCOUNT.LK && (
                              <h6>Giá trị tích luỹ</h6>
                            )}
                            {typeDiscount ===
                              TYPE_DISCOUNT["DISCOUNT.SOFT.CONDITION"] && (
                              <h6>Số lượng mua</h6>
                            )}
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
                                {...(typeDiscount === TYPE_DISCOUNT.LK && {
                                  label: "Từ",
                                })}
                                {...(typeDiscount ===
                                  TYPE_DISCOUNT["DISCOUNT.SOFT.CONDITION"] && {
                                  label: "Mỗi",
                                })}
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
                                    min={
                                      typeDiscount === TYPE_DISCOUNT.LK ? 0 : 1
                                    }
                                    {...(!form.getFieldValue([
                                      "cumulativeDiscount",
                                      name,
                                      "applyVariantId",
                                    ]) && {
                                      addonAfter: <div>VNĐ</div>,
                                      step: 1000,
                                    })}
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
                                    {...(typeDiscount === TYPE_DISCOUNT.LK && {
                                      label: "Đến",
                                    })}
                                    {...(typeDiscount ===
                                      TYPE_DISCOUNT[
                                        "DISCOUNT.SOFT.CONDITION"
                                      ] && { label: "Tối đa" })}
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
                                        ]) && {
                                          addonAfter: <div>VNĐ</div>,
                                          step: 1000,
                                        })}
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
                                      changeForm({
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
                          {/* <Space className="mb-3">
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
                                  "applyTimeSheet",
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
                          </Space> */}
                          {typeDiscount === TYPE_DISCOUNT.LK && (
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
                            </>
                          )}
                        {typeRepeat !== TYPE_REPEAT.noTime && 
                        <>
                        <Divider orientation="left">
                            <h6> Thời gian áp dụng</h6>
                          </Divider>
                          <ApplyTimeSheet
                            form={form}
                            name={name}
                            loading={loading}
                            restField={restField}
                          />
                        </>}
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
