import { Alert, Button, Col, Flex, Form, Row, Select, Typography } from "antd";
import React from "react";
import DebounceSelectMultipleItem from "~/components/common/DebounceSelectMultiple/DebounceSelectMultipleItem";
import { DebounceSelectMultipleProvider } from "~/components/common/DebounceSelectMultiple/DebounceSelectMultipleProvider";
import SelectIdsCustomerApply from "./SelectIdsCustomerApply";
type propsType = {
  form: any;
};
export default function CustomerApplyFormItem({ form }: propsType): React.JSX.Element {
  return (
    <DebounceSelectMultipleProvider 
      initValuePharmacy={form.getFieldValue('customerApplyIds')?.filter((item:any) => item?.refCollection === "pharma_profile")?.map((item:any) => item?.id)}
      initValuePartner={form.getFieldValue('customerApplyIds')?.filter((item:any) => item?.refCollection === "partner")?.map((item:any) => item?.id)}
    >
  <Form.Item shouldUpdate={(p,n) => p?.customerApplyIds !== n?.customerApplyIds} noStyle>
    {({getFieldValue}) =>   
    <Form.Item labelCol={{ span: 24 }} label="Các khách hàng được phép dùng:">
      <Form.List name={"customerApplyIds"}>
        {(fields, { add, remove }) => (
          <>
          {!getFieldValue('customerApplyIds')?.length && <Alert showIcon style={{textAlign : 'center',marginBottom : 8}} message="Tất cả các khách hàng để được phép dùng nếu chưa thêm ai vào" type="info" />}
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
                  <Form.Item shouldUpdate>
                    {() => <Form.Item name={[index, "id"]}>
                      <DebounceSelectMultipleItem refCollection={refCollection} />
                    </Form.Item>}
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
    </Form.Item>
      }
  </Form.Item>
  </DebounceSelectMultipleProvider>
  );
}
