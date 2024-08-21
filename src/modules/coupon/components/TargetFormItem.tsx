import { Alert, Button, Col, Flex, Form, Row, Select } from "antd";
import React, { useMemo } from "react";
import { DebounceSelectMultipleProvider } from "~/components/common/DebounceSelectMultiple/DebounceSelectMultipleProvider";
import SelectIds from "./SelectIds";
type propsType = {
  targetIds: any;
};
export default function TargetFormItem({ targetIds }: propsType): React.JSX.Element {
  const valuesProduct = useMemo(() => targetIds
  ?.filter((item : any) => item?.refCollection === "product")
  ?.map((item: any) => item?.id),[targetIds]);

  const valuesProductGroup = useMemo(() => targetIds
  ?.filter((item : any) => item?.refCollection === "product_group")
  ?.map((item: any) => item?.id),[targetIds]);

  
  return (
    <DebounceSelectMultipleProvider
      valuesProduct={valuesProduct}
      valuesProductGroup={valuesProductGroup}
      useProduct
      useProductGroup
    >
      <Form.Item shouldUpdate noStyle>
        {({ getFieldValue }) => (
          <Form.Item
            hidden={getFieldValue("target") === "BILL"}
            labelCol={{ span: 24 }}
            label="Các mặt hàng được phép dùng"
          >
            <Form.List name={"targetIds"}>
              {(fields, { add, remove }) => (
                <>
                  {!getFieldValue("targetIds")?.length && (
                    <Alert
                      showIcon
                      style={{ textAlign: "center", marginBottom: 8 }}
                      message="Chưa có mặt hàng nào được sử dụng"
                      type="warning"
                    />
                  )}
                  {fields.map((field, index) => {
                    const refCollection = getFieldValue([
                      "targetIds",
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
                              placeholder="Loại mặt hàng"
                              options={[
                                {
                                  label: "Nhóm sản phẩm",
                                  value: "product_group",
                                },
                                {
                                  label: "mặt hàng",
                                  value: "product",
                                },
                              ]}
                            />
                          </Form.Item>
                        </Col>
                        <Col flex={1}>
                          <Form.Item name={[index, "id"]}>
                            <SelectIds
                              refCollection={refCollection}
                              index={index}
                            />
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
                      onClick={() => add({ refCollection: "product" })}
                    >
                      Thêm mặt hàng
                    </Button>
                    <Button
                      type="dashed"
                      block
                      onClick={() => add({ refCollection: "product_group" })}
                    >
                      Thêm Nhóm sản phẩm
                    </Button>
                  </Flex>
                </>
              )}
            </Form.List>
          </Form.Item>
        )}
      </Form.Item>
    </DebounceSelectMultipleProvider>
  );
}
