import { InfoCircleFilled, QuestionCircleFilled } from "@ant-design/icons";
import { AutoComplete, Col, Divider, Flex, Form, Input, Radio, Row, Tooltip, Typography } from "antd";
import TextArea from "antd/es/input/TextArea";
import React from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { concatAddress, filterOptionSlug, formatter } from "~/utils/helpers";
import { FormFieldCreateBill } from "../../bill.modal";
import useCreateBillStore from "../../storeContext/CreateBillContext";
import SelectDebt from "./SelectDebt";
type propsType = {};
export const Layout = ({
  label,
  children,
  isLarge,
  tooltip,
}: {
  label: any;
  children: any;
  isLarge?: boolean;
  tooltip?: string;
}) => (
  <Row justify={"space-between"} align="middle">
    <Col>
      <Typography.Text
        style={{ fontSize: isLarge ? 18 : 14, fontWeight: isLarge ? 600 : 400 }}
      >
        {label}: &nbsp;
      {tooltip && <Tooltip title={tooltip}>
          <InfoCircleFilled />
        </Tooltip>}
      </Typography.Text>
    </Col>
    <Col flex={1}>
      <Flex style={{width : '100%'}} justify={'end'}>
      {children}
      </Flex>
    </Col>
  </Row>
);
export default function TotalBill(props: propsType): React.JSX.Element {
  const {
    totalPrice,
    totalQuantity,
    totalPriceAfterDiscount,
    totalDiscount,
    totalDiscountFromProduct,
    totalDiscountFromSupplier,
    form,
    totalAmount,
    totalDiscountOther,
    address,
  } = useCreateBillStore();
  const debtType = Form.useWatch('debtType',form);
  const fee = Form.useWatch('fee',form);
  
  return (
    <Flex vertical gap={"small"}>
      <Layout label={"Số lượng mặt hàng"}>{formatter(totalQuantity)}</Layout>
      <Layout label={"Tổng tiền"}>{formatter(totalPrice)}</Layout>
      {totalDiscountFromProduct?.["DISCOUNT.CORE"] ? (
        <Layout label={"Tổng chiết khấu cứng từ mặt hàng"}>
          <Typography.Text type="warning">
            -{formatter(totalDiscountFromProduct?.["DISCOUNT.CORE"])}
          </Typography.Text>
        </Layout>
      ) : null}
      {totalDiscountFromProduct?.["DISCOUNT.SOFT"] ? (
        <Layout label={"Tổng chiết khấu mềm từ mặt hàng"}>
          <Typography.Text type="warning">
            -{formatter(totalDiscountFromProduct?.["DISCOUNT.SOFT"])}
          </Typography.Text>
        </Layout>
      ) : null}
      {totalDiscountFromProduct?.["LK"] ? (
        <Layout label={"Tổng chiết khấu luỹ kế từ mặt hàng"}>
          <Typography.Text type="warning">
            -{formatter(totalDiscountFromProduct?.["LK"])}
          </Typography.Text>
        </Layout>
      ) : null}
      {totalDiscountFromSupplier?.["DISCOUNT.CORE"] ? (
        <Layout label={"Tổng chiết khấu cứng từ nhà cung cấp"}>
          <Typography.Text type="warning">
            -{formatter(totalDiscountFromSupplier?.["DISCOUNT.CORE"])}
          </Typography.Text>
        </Layout>
      ) : null}
      {totalDiscountFromSupplier?.["DISCOUNT.SOFT"] ? (
        <Layout label={"Tổng chiết khấu mềm từ nhà cung cấp"}>
          <Typography.Text type="warning">
            -{formatter(totalDiscountFromSupplier?.["DISCOUNT.SOFT"])}
          </Typography.Text>
        </Layout>
      ) : null}
      {totalDiscountFromSupplier?.["LK"] ? (
        <Layout label={"Tổng chiết khấu luỹ kế từ nhà cung cấp"}>
          <Typography.Text type="warning">
            -{formatter(totalDiscountFromSupplier?.["LK"])}
          </Typography.Text>
        </Layout>
      ) : null}
      <Layout label={"Tổng chiết khấu"}>
      <Typography.Text type="warning" strong>
        {formatter(totalDiscount + totalDiscountOther)}
      </Typography.Text>
        </Layout>
      <Layout tooltip="Tổng tiền sau chiết khấu có lúc không bằng Tổng tiền - Tổng chiết khấu" label={"Tổng tiền sau chiết khấu"}>
      <Typography.Text type="warning" strong>
        {formatter(totalAmount)}
      </Typography.Text>
        </Layout>
        <SelectDebt />
        {debtType === 'DEPOSIT' && <Layout label={"Khách trả trước"}>
        <Form.Item<FormFieldCreateBill> name="pair" style={{marginBottom : 'unset'}} rules={[
          {
            validator(_, value) {
              if (value <= totalAmount) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Số tiền không hợp lệ!'));
            }
          },
        ]}>
          <InputNumberAnt addonAfter={'VNĐ'} style={{width : 200}} min={0} max={totalAmount}/>
        </Form.Item>
      </Layout>}
    {fee ? <Layout label={'Phụ phí'}>
    <Form.Item shouldUpdate noStyle>
      {({getFieldValue}) =>   <Form.List 
      name="fee"
          >
            {(fields, {}) => (
              <>
                {fields.map((field, index) => (
                        <Form.Item
                        style={{marginBottom : 'unset'}}
                          // label="Phụ phí bán hàng"
                          name={[index, "value"]}
                          rules={[
                            ({}) => ({
                              validator(_, value) {
                                if (getFieldValue(['fee',index,'typeValue']) === 'PERCENT' && value > 100) {
                                  return Promise.reject(new Error('Phần trăm phải bé hơn 100%!'));
                                }
                                return Promise.resolve();
                              
                              }
                            })
                          ]}
                        >
                          <InputNumberAnt {...getFieldValue(['fee',index,'typeValue']) === 'PERCENT' && {max : 100}} addonAfter={<Form.Item style={{marginBottom : 'unset'}} name={[index, "typeValue"]}>
                            <Radio.Group size="small" buttonStyle="solid">
                                <Radio.Button value="PERCENT">%</Radio.Button>
                                <Radio.Button value="VALUE">Giá trị</Radio.Button>
                              </Radio.Group>
                            </Form.Item>}/>
                        </Form.Item>
                        
                ))}
              </>
            )}
          </Form.List>}
    </Form.Item>
      </Layout> : <Form.Item hidden name={'fee'}/>}

      <Layout label={'Địa chỉ giao hàng'}>
      <Form.Item  shouldUpdate noStyle>
    {() => <Form.Item
    
    name={'deliveryAddress'}
    style={{marginBottom : 'unset',width : '100%'}}
    >
    <AutoComplete
    popupMatchSelectWidth={false}
    options={address?.map((add) => ({
      label : concatAddress(add),
      value : concatAddress(add),
    }))}
    filterOption={filterOptionSlug}
    >
      <TextArea
        placeholder="Nhập địa chỉ"
      />
    </AutoComplete>
    </Form.Item>}
  </Form.Item>
      </Layout>
      <div
        style={{
          width: "100%",
          height: 3,
          borderTop: "2px dashed #F0F0F0",
          marginTop: 5,
          marginBottom: 5,
        }}
      />
      <Layout isLarge={true} label={"Tổng tiền phải trả"}>
        <Typography.Text style={{ fontSize: 18, fontWeight: 600 }}>
          {formatter(totalPriceAfterDiscount)}
        </Typography.Text>
      </Layout>
    </Flex>
  );
}
