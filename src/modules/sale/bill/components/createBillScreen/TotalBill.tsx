import { Col, Divider, Flex, Form, Row, Typography } from "antd";
import React from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { formatter } from "~/utils/helpers";
import { FormFieldCreateBill } from "../../bill.modal";
import useCreateBillStore from "../../storeContext/CreateBillContext";
type propsType = {};
const Layout = ({
  label,
  children,
  isLarge,
}: {
  label: any;
  children: any;
  isLarge?: boolean;
}) => (
  <Row justify={"space-between"} align="middle">
    <Col>
      <Typography.Text
        style={{ fontSize: isLarge ? 18 : 16, fontWeight: isLarge ? 600 : 400 }}
      >
        {label}
      </Typography.Text>
    </Col>
    <Col>{children}</Col>
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
  } = useCreateBillStore();
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
        {formatter(totalDiscount)}
      </Typography.Text>
        </Layout>
      {/* <Layout label={"Khách trả trước"}>
        <Form.Item<FormFieldCreateBill> name="pair">
          <InputNumberAnt addonAfter={'VNĐ'} style={{width : 200}} min={0} max={totalPriceAfterDiscount}/>
        </Form.Item>
      </Layout> */}
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
