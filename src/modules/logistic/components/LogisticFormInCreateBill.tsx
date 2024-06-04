import {
  Button,
  Col,
  ConfigProvider,
  Flex,
  Form,
  Input,
  InputNumber,
  Popconfirm,
  Row,
  Select,
  Skeleton,
} from "antd";
import React, { useEffect, useState } from "react";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import { serviceLogistic, serviceViettelPost } from "../constants";
import subvn from "~/core/subvn";
import { compact } from "lodash";
import useUpdateBillStore from "~/modules/sale/bill/storeContext/UpdateBillContext";
import {
  SubmitCountLogisticFee,
  useCountFee,
  useGetFee,
  useResetLogisticAction,
} from "../logistic.hook";
import useNotificationStore from "~/store/NotificationContext";
import { useUpdateApplyLogisticUnit } from "~/modules/sale/bill/bill.hook";
import { useDispatch } from "react-redux";
import { billSliceAction } from "~/modules/sale/bill/redux/reducer";
import { logisticActions } from "../redux/reducer";
import CheckboxConfirm from "./CheckboxConfirm";
type propsType = {};

const typeSent = [
  {
    label: "Thu gom tận nơi",
    value: "TGTN",
  },
  {
    label: "Gửi hàng tại bưu cục",
    value: "GHBC",
  },
];
const transportUnit = [
  {
    label: "Bưu điện Việt Nam",
    value: "VIETNAMPOST",
  },
  {
    label: "Viettel Post",
    value: "VIETELPOST",
  },
];

interface ValueApplyBill {
  totalFee?: number,
  transportUnit?: "VIETTELPOST" | "VIETNAMPOST",
  VAT?: number,
  height?: number,
  length?: number,
  width?: number
};

export default function LogisticFormCreateInBill(props: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const { bill, onCloseFormLogistic, setCheckboxPayment, checkboxPayment } = useUpdateBillStore();
  const { onNotify } = useNotificationStore();
  const { pharmacy } = bill;
  const [transportUnitValue, setTransportUnitValue] = useState("VIETNAMPOST");
  const [isLoadingSubmit, onCountFee] = useCountFee();
  const dispatch = useDispatch();

  const [isLoadingUpdate, updateApplyLogistic] = useUpdateApplyLogisticUnit(() => {
    onCloseFormLogistic();
    dispatch(billSliceAction.resetActionLogistic());
    dispatch(logisticActions.resetAction());
  });

  const fee = useGetFee();
  // useResetLogisticAction();

  // useEffect(() => { 
  //     form.setFieldsValue({
  //       senderName: "WorldPharma",
  //       receiverName: pharmacy?.fullName ?? pharmacy?.name,
  //       scope: 1, // Default postage is domestic
  //       receiverNational: "VN", // Default country is Vietnam
  //       transportUnit: transportUnitValue,
  //     });
  // }, [bill]);

  // useEffect(() => {
  //   if (deliveryAddressId) {
  //     const receiverCommuneName = subvn.getWardsByCode(
  //       deliveryAddressId?.wardId
  //     )?.name;
  //     const receiverDistrictName = subvn.getDistrictByCode(
  //       deliveryAddressId?.districtId
  //     )?.name;
  //     const receiverProvinceName = subvn.getCityByCode(
  //       deliveryAddressId?.cityId
  //     )?.name;
  //     const receiverAddress = deliveryAddressId?.street;
  //     form.setFieldsValue({
  //       customerAddress: compact([
  //         receiverAddress,
  //         receiverCommuneName,
  //         receiverDistrictName,
  //         receiverProvinceName,
  //       ]).join(", "),
  //       receiverAddress,
  //     });
  //   }
  // }, [deliveryAddressId]);

  // useEffect(() => {
  //   if (fee) {
  //     form.setFieldsValue({
  //       totalFee: fee?.totalFee,
  //     });
  //   } else {
  //     form.setFieldsValue({
  //       fee: 0,
  //     });
  //   }
  // }, [fee]);

  const onFinish = (values: any) => {
    // const receiverCommuneName = subvn.getWardsByCode(
    //   deliveryAddressId?.wardId
    // )?.name;
    // const receiverDistrictName = subvn.getDistrictByCode(
    //   deliveryAddressId?.districtId
    // )?.name;
    // const receiverProvinceName = subvn.getCityByCode(
    //   deliveryAddressId?.cityId
    // )?.name;
    // const submitData = SubmitCountLogisticFee(values, {
    //   receiverCommuneName,
    //   receiverDistrictName,
    //   receiverProvinceName,
    // });
    try {
      form.validateFields();
      // onCountFee(submitData);
    } catch (error: any) {
      onNotify?.error(error?.message ?? "Có lỗi xảy ra khi tính phí");
    }
  };

  const onValuesChange = (values: any) => {
    const {transportUnit,serviceCode, weight, width, length, height } = values;
    if (transportUnit || serviceCode || weight || width || length || height ) {
      form.setFieldsValue({
        fee: 0,
      })
    };
    if (transportUnit) {
      form.setFieldsValue({
        serviceCode: null,
      })
    };
  };
  const onApplyFeeForBill = () => {
    const values: ValueApplyBill = fee;
    try {
      updateApplyLogistic({
        id: bill?._id,
        dataTransportUnit: {...values}
      });
    } catch (error: any) {
      onNotify?.error(error?.message ?? "Có lỗi xảy ra khi tính phí");
    }
  };

  const renderLoading = (component: React.ReactNode) => {
    return isLoadingSubmit ? <Skeleton.Input active /> : component;
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 8 }}
      wrapperCol={{ span: 16 }}
      labelAlign="left"
      scrollToFirstError={true}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
    >
      <Row gutter={10}>
        <Col span={12}>
          <Form.Item hidden name={"scope"} label={"Loại bưu gửi"}>
            <Input value={1} />
          </Form.Item>
          <Form.Item hidden name={"receiverNational"} label={"Mã quốc gia"}>
            <Input value={"VN"} />
          </Form.Item>
          <BaseBorderBox title={"Người gửi"}>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item name={"senderName"} label={"Người gửi"}>
                  {renderLoading(<Input />)}
                </Form.Item>
              </Col>
            </Row>
          </BaseBorderBox>
          <BaseBorderBox title={"Người nhận"}>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item name={"receiverName"} label={"Người nhận"}>
                  {renderLoading(<Input />)}
                </Form.Item>
                <Form.Item hidden name={"receiverAddress"}>
                  <Input readOnly />
                </Form.Item>
                <Form.Item name={"customerAddress"} label={"Địa chỉ nhận"}>
                  {renderLoading(<Input readOnly />)}
                </Form.Item>
              </Col>
            </Row>
          </BaseBorderBox>
          <BaseBorderBox title={"Dịch vụ vận chuyển"}>
            <Form.Item name={"transportUnit"} label={"Đơn vị vận chuyển"}>
              <Select
                placeholder="Chọn đơn vị vận chuyển"
                options={transportUnit}
                onChange={(value) => setTransportUnitValue(value)}
                value={transportUnitValue}
                loading={isLoadingSubmit}
              />
            </Form.Item>
            <Form.Item
              name={"serviceCode"}
              label={"Tên sản phẩm dịch vụ"}
              rules={[{ required: true, message: "Chọn dịch vụ vận chuyển" }]}
            >
              {transportUnitValue === "VIETNAMPOST" ? (
                <Select
                  placeholder="Chọn dịch vụ"
                  options={serviceLogistic}
                  loading={isLoadingSubmit}
                />
              ) : (
                <Select
                  placeholder="Chọn dịch vụ"
                  options={serviceViettelPost}
                  loading={isLoadingSubmit}
                />
              )}
            </Form.Item>
              <CheckboxConfirm checkboxPayment={checkboxPayment} setCheckboxPayment={setCheckboxPayment}/>
          </BaseBorderBox>
        </Col>
        <Col span={12}>
          <BaseBorderBox title={"Thông tin hàng hoá"}>
            <Form.Item name={"code"} label={"Mã vận đơn"}>
              {renderLoading(<Input placeholder="Sẽ tồn tại khi đơn hàng được gửi đi" />)}
            </Form.Item>
            <Form.Item
              rules={[{ required: true, message: "Vui lòng nhập khối lượng" }]}
              name={"weight"}
              label={"Tổng khối lượng"}
            >
              {renderLoading(
                <InputNumber
                  min={0}
                  addonAfter="gram"
                  style={{ width: "100%" }}
                  placeholder="Tổng khối lượng"
                  formatter={(value) =>
                    `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                  }
                />
              )}
            </Form.Item>
            <Form.Item label={"Kích thước (cm)"}>
              <Flex gap={10} style={{ width: "100%" }}>
                <Form.Item name={"length"} label={""}>
                  {renderLoading(<InputNumber min={0} placeholder="Dọc" />)}
                </Form.Item>
                <Form.Item name={"width"} label={""}>
                  {renderLoading(<InputNumber min={0} placeholder="Ngang" />)}
                </Form.Item>
                <Form.Item name={"height"} label={""}>
                  {renderLoading(<InputNumber min={0} placeholder="Cao" />)}
                </Form.Item>
              </Flex>
            </Form.Item>
            <Form.Item name={"note"} label={"Nội dung"}>
              {renderLoading(
                <Input.TextArea rows={2} placeholder="Nội dung" />
              )}
            </Form.Item>
          </BaseBorderBox>
          <BaseBorderBox title={"Tổng cước"}>
            <ConfigProvider
              theme={{
                components: {
                  InputNumber: {
                    inputFontSize: 18,
                  },
                },
                token: {
                  colorPrimary: "green",
                },
              }}
            >
              <Form.Item
                name={"totalFee"}
                label={"Tổng cước tạm tính(đã bao gồm VAT)"}
                labelCol={{ span: 12 }}
                wrapperCol={{ span: 12 }}
              >
                {renderLoading(
                  <InputNumber
                    readOnly
                    addonAfter="VND"
                    style={{ width: "100%", fontWeight: "bold" }}
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                    }
                  />
                )}
              </Form.Item>
            </ConfigProvider>
          </BaseBorderBox>
        </Col>
      </Row>
      <Row align={"middle"} justify={"end"}>
        <Button
          loading={isLoadingSubmit}
          type="primary"
          htmlType="submit"
          style={{ marginRight: 10 }}
          icon={
            <i
              style={{ borderRadius: "50%" }}
              className="fa-solid fa-dollar-sign"
            ></i>
          }
        >
          Tính cước
        </Button>
        <Popconfirm
          title={`Bạn có chắc chắn chọn đơn vị vận chuyển cho đơn hàng này là ${
            transportUnit?.find((item) => item.value === transportUnitValue)
              ?.label
          } ?`}
          onConfirm={onApplyFeeForBill}
          // onCancel={() => console.log(2)}
          okText="Đồng ý"
          cancelText="Huỷ"
        >
          <Button loading={isLoadingSubmit || isLoadingUpdate} type="primary" disabled = {!fee}>
            Áp dụng vào đơn hàng
          </Button>
        </Popconfirm>
      </Row>
      {/* <Popconfirm
          onConfirm={onFinish}
          title={`Bạn có chắc chắn muốn tạo bưu gửi này với đơn vị vận chuyển`}
          okText="Tạo"
          cancelText="Huỷ"
        >
          <Row align={'middle'} justify={'end'}>
            <Col span={24}>
              <Button type="primary" htmlType="submit">Tạo bưu gửi</Button>
            </Col>
          </Row>
        </Popconfirm> */}
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
          <span style={{color: 'rgba(249, 6, 6, 0.45)'}}>Giá cước vận chuyển có thể bị thay đổi và cập nhật lại khi đơn hàng được đóng gói vì thay đổi kích thước hoặc phát sinh dịch vụ cộng thêm</span>
        </div>
    </Form>
  );
}
