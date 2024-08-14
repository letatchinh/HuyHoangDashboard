import { Alert, Button, Col, Flex, Form, Row, Select } from "antd";
import React, { useMemo } from "react";
import DebounceSelectMultipleItemCustomer from "~/components/common/DebounceSelectMultiple/DebounceSelectMultipleItemCustomer";
import { DebounceSelectMultipleProvider } from "~/components/common/DebounceSelectMultiple/DebounceSelectMultipleProvider";
import { requireRulesCustom } from "~/constants/defaultValue";
type propsType = {
  customerApplyIds: any;
};
export default function CustomerApplyFormItem({customerApplyIds }: propsType): React.JSX.Element {
  const valuesPharmacy = useMemo(() => customerApplyIds
  ?.filter((item : any) => item?.refCollection === "pharma_profile")
  ?.map((item: any) => item?.id),[customerApplyIds]);

  const valuesPartner = useMemo(() => customerApplyIds
  ?.filter((item : any) => item?.refCollection === "partner")
  ?.map((item: any) => item?.id),[customerApplyIds]);
  return (
    <DebounceSelectMultipleProvider 
      usePharmacy
      usePartner
      valuesPharmacy={valuesPharmacy}
      valuesPartner={valuesPartner}
    >
  <Form.Item shouldUpdate={(p,n) => p?.customerApplyIds !== n?.customerApplyIds} noStyle>
    {({getFieldValue}) =>   
    <Form.Item labelCol={{ span: 24 }} label="Các khách hàng được phép dùng:">
      <Form.List name={"customerApplyIds"}>
        {(fields, { add, remove }) => (
          <>
          {!getFieldValue('customerApplyIds')?.length && <Alert showIcon style={{textAlign : 'center',marginBottom : 8}} message="Tất cả các khách hàng để được phép dùng nếu chưa thêm ai vào" type="info" />}
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
                    {() => <Form.Item rules={requireRulesCustom("Vui lòng chọn người dùng mã")} name={[index, "id"]}>
                      <DebounceSelectMultipleItemCustomer refCollection={refCollection} />
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
