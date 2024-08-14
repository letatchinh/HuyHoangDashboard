import { Button, Checkbox, Col, Divider, Flex, Form, Row, Select } from "antd";
import React, { useMemo } from "react";
import DebounceSelectMultipleItemCustomer from "~/components/common/DebounceSelectMultiple/DebounceSelectMultipleItemCustomer";
import { DebounceSelectMultipleProvider } from "~/components/common/DebounceSelectMultiple/DebounceSelectMultipleProvider";
import { requireRulesCustom } from "~/constants/defaultValue";
type propsType = {
  customerApplyIds: any;
  allowAllApply: any;
};
export default function CustomerApplyFormItem({customerApplyIds,allowAllApply }: propsType): React.JSX.Element {

  const valuesPharmacy = useMemo(() => customerApplyIds
  ?.filter((item : any) => item?.refCollection === "pharma_profile")
  ?.map((item: any) => item?.id),[customerApplyIds]);

  const valuesPartner = useMemo(() => customerApplyIds
  ?.filter((item : any) => item?.refCollection === "partner")
  ?.map((item: any) => item?.id),[customerApplyIds]);

  return (
    <>
      <Form.Item style={{marginBottom : 'unset'}} label="Áp dụng cho mọi khách hàng">
        <Form.Item shouldUpdate={(p,n) => p?.allowAllApply !== n?.allowAllApply} noStyle>
          {({getFieldValue}) =>   <Flex gap={20}>
        <Form.Item
          name={["allowAllApply", "all"]}
          valuePropName="checked"
        >
          <Checkbox>Mọi đối tượng</Checkbox>
        </Form.Item>
        <Form.Item
          name={["allowAllApply", "b2b"]}
          valuePropName="checked"
        >
          <Checkbox disabled={!!getFieldValue(['allowAllApply','all'])}>B2B</Checkbox>
        </Form.Item>
        <Form.Item
          name={["allowAllApply", "b2c"]}
          valuePropName="checked"
        >
          <Checkbox disabled={!!getFieldValue(['allowAllApply','all'])}>B2C</Checkbox>
        </Form.Item>
        </Flex>}
        </Form.Item>
      </Form.Item>
      <Divider/>
      <DebounceSelectMultipleProvider
        usePharmacy
        usePartner
        valuesPharmacy={valuesPharmacy}
        valuesPartner={valuesPartner}
      >
        <Form.Item
          shouldUpdate={(p, n) => p?.customerApplyIds !== n?.customerApplyIds}
          noStyle
        >
          {({ getFieldValue }) => (
            <Form.Item
              labelCol={{ span: 24 }}
              label="Các khách hàng được phép dùng:"
            >
              <Form.List name={"customerApplyIds"}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map((field, index) => {
                      const refCollection = getFieldValue([
                        "customerApplyIds",
                        index,
                        "refCollection",
                      ]);
                      return (
                        <Row gutter={16}>
                          <Col span={6}>
                            <Form.Item name={[index, "refCollection"]}>
                              <Select
                                disabled={!!refCollection}
                                allowClear
                                placeholder="Loại khách hàng"
                                options={[
                                  {
                                    label: "Nhà thuốc",
                                    value: "pharma_profile",
                                  },
                                  {
                                    label: "Cộng tác viên",
                                    value: "partner",
                                  },
                                ]}
                              />
                            </Form.Item>
                          </Col>
                          <Col flex={1}>
                            <Form.Item shouldUpdate>
                              {() => (
                                <Form.Item
                                  rules={requireRulesCustom(
                                    "Vui lòng chọn người dùng mã"
                                  )}
                                  name={[index, "id"]}
                                >
                                  <DebounceSelectMultipleItemCustomer
                                    refCollection={refCollection}
                                  />
                                </Form.Item>
                              )}
                            </Form.Item>
                          </Col>
                          <Col span={2}>
                            <Button
                              onClick={() => remove(index)}
                              danger
                              type="primary"
                            >
                              Gỡ
                            </Button>
                          </Col>
                        </Row>
                      );
                    })}

                    <Flex gap={20} justify="space-between">
                      <Button
                        type="dashed"
                        block
                        onClick={() => add({ refCollection: "pharma_profile" })}
                        disabled={allowAllApply?.b2b || allowAllApply?.all}
                      >
                        Thêm nhà thuốc
                      </Button>
                      <Button
                        type="dashed"
                        block
                        onClick={() => add({ refCollection: "partner" })}
                        disabled={allowAllApply?.b2c || allowAllApply?.all}
                      >
                        Thêm cộng tác viên
                      </Button>
                    </Flex>
                  </>
                )}
              </Form.List>
            </Form.Item>
          )}
        </Form.Item>
      </DebounceSelectMultipleProvider>
    </>
  );
}
