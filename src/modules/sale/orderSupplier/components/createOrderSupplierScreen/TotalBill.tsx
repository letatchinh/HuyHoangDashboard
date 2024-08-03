import { EditOutlined, InfoCircleFilled, QuestionCircleFilled } from "@ant-design/icons";
import { Col, Divider, Flex, Form, Row, Tooltip, Typography } from "antd";
import React from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import { formatter } from "~/utils/helpers";
import { FormFieldCreateOrderSupplier } from "../../orderSupplier.modal";
import useCreateBillStore from "../../storeContext/CreateOrderSupplierContext";
// import SelectDebt from "./SelectDebt";
type propsType = {};
const Layout = ({
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
        {label} &nbsp;
        {tooltip && (
          <Tooltip title={tooltip}>
            <InfoCircleFilled />
          </Tooltip>
        )}
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
    form,
    totalAmount,
    bill,
    onOpenModalWarehouse,
  } = useCreateBillStore();
  const debtType = Form.useWatch("debtType", form);

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
      {/* <Layout
        tooltip="Tổng tiền sau chiết khấu có lúc không bằng Tổng tiền - Tổng chiết khấu"
        label={"Tổng tiền sau chiết khấu"}
      >
        <Typography.Text type="warning" strong>
          {formatter(totalAmount)}
        </Typography.Text>
      </Layout> */}
      <Layout
        label={
          <span>
            <i className="fa-solid fa-location-dot"></i> Kho nhập hàng
              <EditOutlined
                onClick={onOpenModalWarehouse}
                style={{ color: "#5AB2FF" }}
              />
          </span>
        }
      >
        <Typography.Text type="warning" strong>
          {bill?.warehouseName}
        </Typography.Text>
      </Layout>
      {/* <SelectDebt /> */}
      {debtType === "DEPOSIT" && (
        <Layout label={"Khách trả trước"}>
          <Form.Item<FormFieldCreateOrderSupplier>
            name="pair"
            style={{ margin: 0 }}
            rules={[
              {
                validator(_, value) {
                  if (value <= totalAmount) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error("Số tiền không hợp lệ!"));
                },
              },
            ]}
          >
            <InputNumberAnt
              addonAfter={"VNĐ"}
              style={{ width: 200 }}
              min={0}
              max={totalAmount}
            />
          </Form.Item>
        </Layout>
      )}
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
