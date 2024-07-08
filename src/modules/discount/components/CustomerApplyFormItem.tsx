import { Button, Col, Flex, Form, Row, Select } from "antd";
import React from "react";
import SelectIds from "./SelectIds";
import SelectIdsCustomerApply from "./SelectIdsCustomerApply";
type propsType = {
  form: any;
};
export default function CustomerApplyFormItem({ form }: propsType): React.JSX.Element {
  return (
  <Form.Item shouldUpdate noStyle>
    {() =>   <Form.Item labelCol={{ span: 24 }} label="Các khách hàng được phép dùng">
      <Form.List name={"customerApplyIds"}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => {
              const refCollection = form.getFieldValue([
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
                  <Form.Item name={[index, "id"]}>
                      <SelectIdsCustomerApply form={form} refCollection={refCollection} index={index} />
                    </Form.Item>
                  </Col>
                  <Col span={2}>
                    <Button onClick={() => remove(index)} danger type="primary">
                      Gỡ
                    </Button>
                  </Col>
                </Row>
              );
            })}
          <Flex gap={20} justify='space-between'>
          <Button
              type="dashed"
              block
              onClick={() => add({refCollection : 'pharma_profile'})}
            >
              Thêm nhà thuốc
            </Button>
            <Button
              type="dashed"
              block
              onClick={() => add({refCollection : 'partner'})}
            >
              Thêm cộng tác viên
            </Button>
          </Flex>
          </>
        )}
      </Form.List>
    </Form.Item>}
  </Form.Item>
  );
}
