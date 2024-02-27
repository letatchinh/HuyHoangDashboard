import { CloseSquareOutlined, PlusCircleOutlined } from "@ant-design/icons";
import { Button, Col, Form, Modal, notification, Popconfirm, Row, Select, Tooltip } from "antd";
import { get } from "lodash";
import React, { useCallback, useState } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import RenderLoading from "~/components/common/RenderLoading";
import { cumulativeDiscountType } from "~/modules/cumulativeDiscount/cumulativeDiscount.modal";
import UnitModule from "~/modules/productUnit";
import { useGetListProductUnitAll } from "~/modules/productUnit/productUnit.hook";
import { filterSelectWithLabel } from "~/utils/helpers";
import { TypePropVariants } from "../product.modal";
import { validateChangeVariants } from "../product.service";
export default function Variants({
  form,
  isLoading: loading,
  // setDataNotificationUndo,
}: TypePropVariants): React.JSX.Element {
  const [reFetch, setReFetch] = useState(false);
  const [units, isLoading] = useGetListProductUnitAll(reFetch);
  const variants = Form.useWatch("variants", form);
  const cumulativeDiscount = Form.useWatch("cumulativeDiscount", form);
  
  const [open, setOpen] = useState(false);
  const onOpen = useCallback(() => setOpen(true), []);
  const onClose = useCallback(() => setOpen(false), []);
  const onCreateSuccess = useCallback(() => {
    setReFetch(!reFetch);
    onClose();
  }, [reFetch]);
  const isUsed = (cur: string, unitId: String) =>
    unitId !== cur &&
    variants?.some((variant: any) => get(variant, "productUnit") === unitId);
  return (
    <>
      <Form.List name={"variants"}>
        {(fields, { add, remove }) => {
          return (
            <>
              {fields.map(({ key, name, fieldKey, ...restField }: any, index) =>
                {
                  
                  const isVariantUsedInDiscount = !!get(variants,[name,'_id']) && cumulativeDiscount?.some((discount : cumulativeDiscountType) => (get(discount,'applyVariantId') === get(variants,[name,'_id'])));
                  
                  return index === 0 ? (
                    <Row className="mb-2" gutter={8} key={key} align="middle">
                      <Col span={6}>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          {...restField}
                          label={"Đơn vị cơ bản"}
                          name={[name, "productUnit"]}
                          rules={[
                            {
                              required: true,
                              message: "Xin vui lòng chọn!",
                            },
                          ]}
                        >
                          {RenderLoading(
                            loading,
                            <Select
                              options={units
                                ?.filter(
                                  (item: any) =>
                                    !isUsed(
                                      form.getFieldValue([
                                        "variants",
                                        name,
                                        "productUnit",
                                      ]),
                                      get(item, "_id")
                                    )
                                )
                                ?.map((item: any) => ({
                                  label: get(item, "name"),
                                  value: get(item, "_id"),
                                  disabled : isVariantUsedInDiscount
                                }))}
                              showSearch
                              filterOption={filterSelectWithLabel}
                              // onSelect={() => validateChangeVariants({cumulativeDiscount,variants : form.getFieldValue('variants'),form,setDataNotificationUndo})}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          {...restField}
                          label={"Giá niêm yết"}
                          name={[name, "price"]}
                          rules={[
                            {
                              required: true,
                              message: "Xin vui lòng nhập!",
                            },
                          ]}
                        >
                          {RenderLoading(loading, <InputNumberAnt min={0} />)}
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item shouldUpdate noStyle>
                          {() => (
                            <Form.Item
                              style={{ marginBottom: 0 }}
                              {...restField}
                              label={"Giá thu về"}
                              name={[name, "cost"]}
                              rules={[
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    const price = getFieldValue([
                                      "variants",
                                      name,
                                      "price",
                                    ]);
                                    if (!value || value <= price) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      "Giá nhập phải bé hơn giá bán"
                                    );
                                  },
                                }),
                              ]}
                            >
                              {RenderLoading(loading, <InputNumberAnt min={0} />)}
                            </Form.Item>
                          )}
                        </Form.Item>
                      </Col>
                    </Row>
                  ) : (
                    <Row className="mb-2" gutter={8} key={key} align="middle">
                      <Col span={6}>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          {...restField}
                          label={"Đơn vị"}
                          name={[name, "productUnit"]}
                          rules={[
                            {
                              required: true,
                              message: "Xin vui lòng chọn!",
                            },
                          ]}
                        >
                          {RenderLoading(
                            loading,
                            <Select
                              options={units
                                ?.filter(
                                  (item: any) =>
                                    !isUsed(
                                      form.getFieldValue([
                                        "variants",
                                        name,
                                        "productUnit",
                                      ]),
                                      get(item, "_id")
                                    )
                                )
                                ?.map((item: any) => ({
                                  label: get(item, "name"),
                                  value: get(item, "_id"),
                                  disabled : isVariantUsedInDiscount
                                }))}
                            />
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          {...restField}
                          label={"Giá niêm yết"}
                          name={[name, "price"]}
                          rules={[
                            {
                              required: true,
                              message: "Xin vui lòng nhập!",
                            },
                          ]}
                        >
                          {RenderLoading(loading, <InputNumberAnt min={0} />)}
                        </Form.Item>
                      </Col>
                      <Col span={5}>
                        <Form.Item shouldUpdate noStyle>
                          {({ getFieldValue }) => (
                            <Form.Item
                              style={{ marginBottom: 0 }}
                              {...restField}
                              label={"Giá thu về"}
                              name={[name, "cost"]}
                              rules={[
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    const price = getFieldValue([
                                      "variants",
                                      name,
                                      "price",
                                    ]);
                                    if (!value || value <= price) {
                                      return Promise.resolve();
                                    }
                                    return Promise.reject(
                                      "Giá nhập phải bé hơn giá bán"
                                    );
                                  },
                                }),
                              ]}
                            >
                              {RenderLoading(
                                loading,
                                <InputNumberAnt
                                  min={0}
                                  // max={getFieldValue(["variants", name, "price"])}
                                />
                              )}
                            </Form.Item>
                          )}
                        </Form.Item>
                      </Col>
                      <Col span={6}>
                        <Form.Item
                          style={{ marginBottom: 0 }}
                          {...restField}
                          label={"Giá trị quy đổi"}
                          name={[name, "exchangeValue"]}
                          rules={[
                            {
                              required: true,
                              message: "Xin vui lòng nhập!",
                            },
                          ]}
                        >
                          {RenderLoading(loading, <InputNumberAnt min={0} />)}
                        </Form.Item>
                      </Col>
  
                      <Col span={1}>
                        <Popconfirm
                          title="Bạn muốn xoá đơn vị này?"
                          onConfirm={() => remove(name)}
                          okText="Xoá"
                          cancelText="Huỷ"
                        >
                        <Tooltip title={isVariantUsedInDiscount ? "Vui lòng gỡ đơn vị ra khỏi chiết khấu để xoá" : null}>
                        <Button type="text" disabled={isVariantUsedInDiscount}>
                        <CloseSquareOutlined
                            style={{ fontSize: 18, color: isVariantUsedInDiscount ? 'GrayText' :"red" }}
                          />
                        </Button>
                        </Tooltip>
                        </Popconfirm>
                      </Col>
                    </Row>
                  )
                }
              )}
              <Button
                onClick={() =>
                  add({
                    variantIsDefault: false,
                  })
                }
                icon={<PlusCircleOutlined />}
              >
                Thêm đơn vị
              </Button>
              <Button onClick={onOpen}>+</Button>
            </>
          );
        }}
      </Form.List>
      <Modal destroyOnClose open={open} onCancel={onClose} footer={null}>
        <UnitModule.page.form
          callBack={onCreateSuccess}
          updateProductUnit={() => {}}
        />
      </Modal>
    </>
  );
}
