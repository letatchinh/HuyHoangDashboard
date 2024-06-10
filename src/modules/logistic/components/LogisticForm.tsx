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
import { compact, omit } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import BaseBorderBox from "~/components/common/BaseBorderBox";
import subvn from "~/core/subvn";
import { useUpdateApplyLogisticUnit } from "~/modules/sale/bill/bill.hook";
import { billSliceAction } from "~/modules/sale/bill/redux/reducer";
import useCreateBillStore from "~/modules/sale/bill/storeContext/CreateBillContext";
import useNotificationStore from "~/store/NotificationContext";
import {
  ADDON_SERVICE,
  TRANSPORT_NAME,
  serviceLogistic,
  serviceViettelPost,
  transportUnit,
} from "../constants";
import {
  SubmitCountLogisticFee,
  useCountFee,
  useGetFee,
  useResetLogisticAction,
  useUpdateFeeInRedux,
} from "../logistic.hook";
import { TRANSPORT_NAME_TYPE } from "../logistic.modal";
import { logisticActions } from "../redux/reducer";
import CheckboxConfirm from "./CheckboxConfirm";
import { concatAddress } from "~/utils/helpers";


export interface ValueApplyBill {
  totalFee?: number;
  transportUnit?: TRANSPORT_NAME_TYPE;
  VAT?: number;
  height?: number;
  length?: number;
  width?: number;
  serviceCode?: string;
  addonService?: any;
  payer?: string;
  serviceName?: string;
};
type propsType = {
  bill?: any;
  onCloseFormLogistic: () => void;
  setCheckboxPayment: (value: any) => void;
  checkboxPayment: string | null;
  id?: string | null;
  deliveryAddressId?: any;
  pharmacy?: any;
  dataTransportUnit?: ValueApplyBill;
  warehouseInfo?: any
};

export default function LogisticForm({
  bill,
  onCloseFormLogistic,
  setCheckboxPayment,
  checkboxPayment,
  id,
  deliveryAddressId,
  pharmacy,
  dataTransportUnit,
  warehouseInfo,
}: propsType): React.JSX.Element {
  useResetLogisticAction();
  const { onAddLogisticFee } = useCreateBillStore();
  const [form] = Form.useForm();
  const { onNotify } = useNotificationStore();
  const [transportUnitValue, setTransportUnitValue] =
    useState<TRANSPORT_NAME_TYPE>(
      TRANSPORT_NAME.VIETNAMPOST as TRANSPORT_NAME_TYPE
    );
  const [isLoadingSubmit, onCountFee] = useCountFee();
  const [serviceName, setServiceName] = useState<string | null>(null);
  const dispatch = useDispatch();
  const [isLoadingUpdate, updateApplyLogistic] = useUpdateApplyLogisticUnit(
    () => {
      onCloseFormLogistic();
      dispatch(billSliceAction.resetActionLogistic());
      dispatch(logisticActions.resetAction());
    }
  );
  const fee = useGetFee();
  const [,updateFeeRedux] = useUpdateFeeInRedux();

  const FindAddress = useCallback(() => {
    type TypeItem = string | undefined;
    if (deliveryAddressId) {
      const receiverCommuneName = subvn.getWardsByCode(
        deliveryAddressId?.wardId
      )?.name;
      const receiverDistrictName= subvn.getDistrictByCode(
        deliveryAddressId?.districtId
      )?.name;
      const receiverProvinceName= subvn.getCityByCode(
        deliveryAddressId?.cityId
      )?.name;
      const receiverAddress = deliveryAddressId?.street;
      return {
        receiverCommuneName,
        receiverDistrictName,
        receiverProvinceName,
        receiverAddress,
      };
    };
    return {
      receiverCommuneName: undefined,
      receiverDistrictName: undefined,
      receiverProvinceName: undefined,
      receiverAddress: undefined,
    };
  }, [deliveryAddressId]);

  useEffect(() => {
    form.setFieldsValue({
      //Set default value
      senderName: "WorldPharma",
      scope: 1, // Default postage is domestic
      receiverNational: "VN", // Default country is Vietnam
      transportUnit: transportUnitValue,
    });
    setTransportUnitValue(dataTransportUnit?.transportUnit ?? "VIETNAMPOST");
    setServiceName(dataTransportUnit?.serviceName ?? null);
      form.setFieldsValue({
        receiverName: pharmacy?.fullName ?? pharmacy?.name,
        payer: dataTransportUnit?.payer,
        ...dataTransportUnit,
      });
  }, [dataTransportUnit, id, pharmacy]);
  useEffect(() => {
    if (deliveryAddressId) {
      form.setFieldsValue({
        customerAddress: concatAddress(deliveryAddressId),
        receiverAddress: deliveryAddressId?.street,
      });
    }
  }, [deliveryAddressId]);
  useEffect(() => {
    if (fee) {
      form.setFieldsValue({
        totalFee: fee?.totalFee,
      });
    } else {
      form.setFieldsValue({
        totalFee: 0,
      });
    }
  }, [fee]);
  useEffect(() => { 
    if (warehouseInfo) {
      form.setFieldsValue({
        warehouseName: warehouseInfo?.name?.vi ?? '',
        warehouseAddress: concatAddress(warehouseInfo?.address)
      });
    }
  },[warehouseInfo]);

  const onFinish = (values: any) => {
    const submitData = SubmitCountLogisticFee(values, {...omit(FindAddress(), ["receiverAddress"])});
    try {
      form.validateFields();
      const payer = form.getFieldsValue().payer;
      const newSubmitData = {
        ...submitData,
        ...(payer === "CUSTOMER" && {
          addonService: [
            {
              code: ADDON_SERVICE[transportUnitValue],
              // description: 'Thu hộ phí ship' ,
            },
          ],
        }),
      };
      onCountFee(newSubmitData);
    } catch (error: any) {
      onNotify?.error("Có lỗi xảy ra khi tính phí");
    }
  };

  const onValuesChange = (values: any) => {
    const { transportUnit, serviceCode, weight, width, length, height, payer } =
      values;
    if (transportUnit || serviceCode || weight || width || length || height || payer) {
      form.setFieldsValue({
        totalFee: 0,
      });
    }
    if (transportUnit) {
      form.setFieldsValue({
        serviceCode: null,
      });
    }
    if (fee) {
      updateFeeRedux({isCanUpdate: false})
    };
  };
  const onApplyFeeForBill = () => {
    const values: ValueApplyBill = {
      ...fee,
      serviceName
    };
    try {
      if (id) {
        updateApplyLogistic({
          id, //Id bill
          dataTransportUnit: { ...values },
        });
      } else {
        onAddLogisticFee(values);
      };
    }catch (error: any) {
      onNotify?.error(error?.message ?? "Có lỗi xảy ra khi áp phí");
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
                  {renderLoading(<Input readOnly />)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item name={"warehouseName"} label={"Kho gửi"}>
                  {renderLoading(<Input readOnly/>)}
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={10}>
              <Col span={24}>
                <Form.Item name={"warehouseAddress"} label={"Địa chỉ kho gửi"}>
                  {renderLoading(<Input readOnly />)}
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
                  onChange={(value, option: any) => setServiceName(option?.label)}
                />
              ) : (
                <Select
                  placeholder="Chọn dịch vụ"
                  options={serviceViettelPost}
                  loading={isLoadingSubmit}
                  onChange={(value, option: any) => setServiceName(option?.label)}
                />
              )}
            </Form.Item>
            <CheckboxConfirm
              checkboxPayment={checkboxPayment}
              setCheckboxPayment={setCheckboxPayment}
            />
          </BaseBorderBox>
        </Col>
        <Col span={12}>
          <BaseBorderBox title={"Thông tin hàng hoá"}>
            <Form.Item name={"code"} label={"Mã vận đơn"}>
              {renderLoading(
                <Input placeholder="Sẽ tồn tại khi đơn hàng được gửi đi" />
              )}
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
          okText="Đồng ý"
          cancelText="Huỷ"
        >
          <Button
            loading={isLoadingSubmit || isLoadingUpdate}
            type="primary"
            disabled={!fee?.isCanUpdate}
          >
            Áp dụng vào đơn hàng
          </Button>
        </Popconfirm>
      </Row>
      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          marginTop: 20,
        }}
      >
        <span style={{ color: "rgba(249, 6, 6, 0.45)" }}>
          Giá cước vận chuyển có thể bị thay đổi và cập nhật lại khi đơn hàng
          được đóng gói vì thay đổi kích thước hoặc phát sinh dịch vụ cộng thêm
        </span>
      </div>
    </Form>
  );
}
