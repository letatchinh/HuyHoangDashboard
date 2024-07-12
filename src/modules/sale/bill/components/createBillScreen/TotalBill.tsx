import { EditOutlined, InfoCircleFilled } from "@ant-design/icons";
import { Button, Flex, Form, Radio, Tag, Tooltip, Typography } from "antd";
import { get } from "lodash";
import React, { CSSProperties, useCallback, useEffect, useState } from "react";
import InputNumberAnt from "~/components/Antd/InputNumberAnt";
import ModalAnt from "~/components/Antd/ModalAnt";
import AddressForm from "~/components/common/AddressForm";
import WithPermission from "~/components/common/WithPermission";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { concatAddress, formatter, getValueOfMath } from "~/utils/helpers";
import { FeeType, FormFieldCreateBill } from "../../bill.modal";
import useCreateBillStore from "../../storeContext/CreateBillContext";
import SuggestAddress from "../SuggestAddress";
import SelectDebt from "./SelectDebt";
import { useGetInfoWarehouse } from "~/modules/warehouse/warehouse.hook";
type propsType = {};
export const Layout = ({
  label,
  children,
  isLarge,
  tooltip,
  styleFlex = {
    flex: 1,
  },
}: {
  label?: any;
  children: any;
  isLarge?: boolean;
  tooltip?: string;
  styleFlex?: CSSProperties
}) => (
  <Flex gap={8} justify={"space-between"} align="middle" wrap={"nowrap"}>
    {label && (
      <Typography.Text
        style={{ fontSize: isLarge ? 18 : 14, fontWeight: isLarge ? 600 : 400 }}
      >
        {label}: &nbsp;
        {tooltip && (
          <Tooltip title={tooltip}>
            <InfoCircleFilled />
          </Tooltip>
        )}
      </Typography.Text>
    )}
    <Flex style={{...styleFlex}} justify={"end"}>
      {children}
    </Flex>
  </Flex>
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
    setFormAndLocalStorage,
    partner,
    onOpenFormLogistic,
    bill,
    onOpenModalSelectWarehouse,
    canReadLogistic,
    canReadWarehouse,
    onOpenCoupon,
    totalDiscountCouponBill,
    totalDiscountCouponShip,
    totalCouponForItem,
    couponSelected,
  } = useCreateBillStore();
  const [minFee, setMinFee] = useState<any>();
  const [openAddress, setOpenAddress] = useState(false);
  const onOpenAddress = useCallback(() => setOpenAddress(true), []);
  const onCloseAddress = useCallback(() => setOpenAddress(false), []);
  const debtType = Form.useWatch("debtType", form);
  // const fee = Form.useWatch("fee", form);
  const onChangeAddress = useCallback(
    (values: any) => {
      const addressString = concatAddress(values?.address);
      bill?.dataTransportUnit
        ? setFormAndLocalStorage({
            deliveryAddress: addressString,
            deliveryAddressId: {
              ...values?.address,
            },
            fee: bill?.fee?.map((item: any) =>
              item?.typeFee === "LOGISTIC" ? { ...item, value: 0 } : item
            ), // If change address when applied logistic, set value logistic fee = 0
            dataTransportUnit: {},
          })
        : setFormAndLocalStorage({
            deliveryAddress: addressString,
            deliveryAddressId: {
              ...values?.address,
            },
          });
      onCloseAddress();
    },
    [bill]
  );
  const [getInfo] = useGetInfoWarehouse();

  useEffect(() => {
    const feePartner = get(partner, "fee", [])?.find(
      (i: FeeType) => i?.typeFee === "SUB_FEE"
    );
    const valueExchange = getValueOfMath(
      totalPrice,
      get(feePartner, "value"),
      get(feePartner, "typeValue")
    );
    setMinFee({
      ...feePartner,
      valueExchange,
    });
  }, [partner, totalPrice]);
  useEffect(() => {
    if (bill?.fee) {
      form.setFieldsValue({
        fee: bill?.fee,
      });
    }
  }, [bill]); // Set value logistic fee
  console.log(bill,'bill')
  return (
    <Flex vertical gap={"small"}>
      <Layout label={"Số lượng mặt hàng"}>{formatter(totalQuantity)}</Layout>
      <Layout label={"Tổng tiền"}>{formatter(totalPrice)}</Layout>
      <Layout label={"Giảm giá"}>{formatter(totalDiscountCouponBill)}</Layout>
      <Layout label={"Giảm giá mặt hàng"}>{formatter(totalCouponForItem)}</Layout>
      <Layout label={"Giảm giá phí ship"}>{formatter(totalDiscountCouponShip)}</Layout>
      {bill?.voucher &&<Layout label={"Đã thanh toán"}>{formatter(bill?.voucher?.totalAmount)}</Layout>}
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
      <Layout
        tooltip="Tổng tiền sau chiết khấu có lúc không bằng Tổng tiền - Tổng chiết khấu"
        label={"Tổng tiền sau chiết khấu"}
      >
        <Typography.Text type="warning" strong>
          {formatter(totalAmount)}
        </Typography.Text>
      </Layout>
      <SelectDebt />
      {debtType === "DEPOSIT" && (
        <Layout label={"Khách trả trước"}>
          <Form.Item<FormFieldCreateBill>
            name="pair"
            style={{ marginBottom: "unset" }}
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
      <Layout>
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => (
            <Form.List name="fee">
              {(fields, {}) => (
                <Flex style={{ width: "100%" }} vertical>
                  {fields.map((field, index) => {
                    const typeFee = getFieldValue(["fee", index, "typeValue"]);
                    const changeValueAtIndex = (newValue: any) => {
                      const fee = getFieldValue("fee");
                      fee[index] = {
                        ...fee[index],
                        ...newValue,
                      };
                      setFormAndLocalStorage({ fee });
                    };
                    if (index === 0) {
                      return (
                        <Form.Item
                          label="Phụ phí"
                          labelCol={{ span: 8 }}
                          labelAlign="left"
                          style={{ marginBottom: 10 }}
                          name={[index, "value"]}
                          rules={[
                            ({}) => ({
                              validator(_, value) {
                                if (typeFee === "PERCENT" && value > 100) {
                                  return Promise.reject(
                                    new Error("Phần trăm phải bé hơn 100%!")
                                  );
                                }
                                return Promise.resolve();
                              },
                            }),
                          ]}
                        >
                          <InputNumberAnt
                            style={{ width: "100%" }}
                            min={
                              typeFee === get(minFee, "typeValue")
                                ? get(minFee, "value", 0)
                                : get(minFee, "valueExchange", 0)
                            }
                            {...(typeFee === "PERCENT" && { max: 100 })}
                            addonAfter={
                              <Form.Item
                                style={{ marginBottom: "unset" }}
                                name={[index, "typeValue"]}
                              >
                                <Radio.Group
                                  onChange={(e) => {
                                    const newValueFee =
                                      e.target.value ===
                                      get(minFee, "typeValue")
                                        ? get(minFee, "value", 0)
                                        : get(minFee, "valueExchange", 0);
                                    changeValueAtIndex({ value: newValueFee });
                                  }}
                                  size="small"
                                  buttonStyle="solid"
                                >
                                  <Radio.Button value="PERCENT">%</Radio.Button>
                                  <Radio.Button value="VALUE">
                                    Giá trị
                                  </Radio.Button>
                                </Radio.Group>
                              </Form.Item>
                            }
                          />
                        </Form.Item>
                      );
                    }
                    if (index === 1) {
                      return (
                        <Form.Item
                          labelCol={{ span: 8 }}
                          labelAlign="left"
                          label={
                            canReadLogistic ? (
                              <span>
                                <i className="fa-solid fa-truck"></i>
                                Phí vận chuyển
                                {getFieldValue("pharmacyId") && (
                                  <EditOutlined
                                    onClick={onOpenFormLogistic}
                                    style={{ color: "#5AB2FF" }}
                                  />
                                )}
                              </span>
                            ) : (
                              "Phí vận chuyển"
                            )
                          }
                          style={{ marginBottom: "unset" }}
                          name={[index, "value"]}
                        >
                          <Flex>
                            <InputNumberAnt
                              min={0}
                              style={{ width: "100%" }}
                              // max={totalAmount}
                              addonAfter={<div>VNĐ</div>}
                              readOnly
                              value={getFieldValue(["fee", index, "value"])}
                            />
                            {/* <Button>Cập nhật</Button> */}
                          </Flex>
                        </Form.Item>
                      );
                    }
                  })}
                </Flex>
              )}
            </Form.List>
          )}
        </Form.Item>
      </Layout>

      <Layout
        label={
          <span>
            <i className="fa-solid fa-location-dot m"></i> Địa chỉ giao
            {bill?.deliveryAddress && (
              <EditOutlined
                onClick={onOpenAddress}
                style={{ color: "#5AB2FF" }}
              />
            )}
          </span>
        }
      >
        <Form.Item shouldUpdate noStyle>
          {({ getFieldValue }) => (
            <Form.Item
              name={"deliveryAddress"}
              style={{ marginBottom: "unset", width: "100%" }}
            >
              <Typography.Text>
                {getFieldValue("deliveryAddress")}
                {!getFieldValue("deliveryAddress") &&
                  getFieldValue("pharmacyId") && (
                    <WithPermission permission={POLICIES.UPDATE_LOGISTIC}>
                      <Button onClick={onOpenAddress} type="primary" ghost>
                        Thay đổi
                      </Button>
                    </WithPermission>
                  )}
              </Typography.Text>
            </Form.Item>
          )}
        </Form.Item>
      </Layout>
      <Layout
        label={
          <span>
            <i className="fa-solid fa-location-dot"></i> Kho xuất hàng
            <WithPermission permission={POLICIES.UPDATE_WAREHOUSELINK}>
            {bill?.warehouseId && (
              <EditOutlined
                onClick={onOpenModalSelectWarehouse}
                style={{ color: "#5AB2FF" }}
              />
            )}
            </WithPermission>
          </span>
        }
        styleFlex={{justifyContent: 'start'}}
      >
        <Typography.Text>{getInfo(bill?.warehouseId)?.name?.vi}</Typography.Text>
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
      <Layout label={<span>Mã giảm giá <Tag color={'blue'}>{`Đã chọn ${get(couponSelected,'bill.length',0) + get(couponSelected,'ship.length',0)} mã`}</Tag></span>}>
        <Typography.Link 
        onClick={() => onOpenCoupon()} style={{ fontSize: 16, fontWeight: 600 }}>
          Chọn mã giảm giá
        </Typography.Link>
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
      <ModalAnt
        title={"Thay đổi địa chỉ giao hàng"}
        width={1000}
        open={openAddress}
        onCancel={onCloseAddress}
        footer={null}
        destroyOnClose
        centered
      >
        <SuggestAddress onClose={onCloseAddress} />
        <AddressForm onSubmit={(values) => onChangeAddress(values)} />
      </ModalAnt>
    </Flex>
  );
}
