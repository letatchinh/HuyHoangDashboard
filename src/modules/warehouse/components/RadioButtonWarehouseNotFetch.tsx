import { Button, Form, Popconfirm, Radio, RadioChangeEvent, Row, Space, Spin } from "antd";
import { get, head } from "lodash";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { STATUS_BILL } from "~/modules/sale/bill/constants";
import { billSliceAction } from "~/modules/sale/bill/redux/reducer";
import useNotificationStore from "~/store/NotificationContext";
type propsType = {
  setValue: (value: number) => void;
  value: number | undefined;
  onClick?: (data?: any) => void ;
  onCancel?: () => void;
  title: string;
  isLoadingWarehouse?: boolean;
  isShowButtonPackageExport?: boolean;
  requestWarehouseExport?: () => void;
  disabledButtonExport?: boolean;
  isSubmitLoading?: boolean;
  warehouseDefault?: any
  updateWarehouseInBill?: (data: any) => void;
  isConfirmChangeLogistic?: boolean;
  listWarehouseLinked: any[];
  splitBill?: boolean;
  onOpenSplitBillForm?: () => void;
};
export default function RadioButtonWarehouse({
  setValue,
  value,
  onClick,
  title,
  isLoadingWarehouse,
  isShowButtonPackageExport = false,
  disabledButtonExport = false,
  requestWarehouseExport,
  isSubmitLoading,
  warehouseDefault,
  updateWarehouseInBill,
  isConfirmChangeLogistic,
  onCancel,
  listWarehouseLinked,
  splitBill,
  onOpenSplitBillForm
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const { onNotify } = useNotificationStore();
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    // updateWarehouseInBill && updateWarehouseInBill(e.target.value);
  };
  const onFinish = (values: any) => {
    if (!values?.warehouseId) {
      return onNotify?.error("Vui lòng chọn kho");
    };
    updateWarehouseInBill && updateWarehouseInBill(values?.warehouseId);
    console.log(values,'values')
    onClick && onClick(values);
  };
  useEffect(() => {
    form.setFieldsValue({ warehouseId: value });
  }, [value]);

  return (
      <Form
        form={form}
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        labelAlign={"left"}
        autoComplete="off"
        onFinish={onFinish}
      >
        {isLoadingWarehouse ? (
          <Spin />
        ) : (
            <Form.Item
              name={"warehouseId"}
              label={"Kho xuất hàng"}
            >
            <Radio.Group
              onChange={onChange}
              value={value || get(head(listWarehouseLinked), "_id")}
            >
              <Space direction="vertical">
                {listWarehouseLinked?.map((item: any) => (
                  <Radio value={ get(item, "_id")}>
                    {get(item, "name.vi") || get(item, "name")}
                  </Radio>
                ))}
              </Space>
            </Radio.Group>
          </Form.Item>
        )}
      <Row justify={"end"}>
        {isShowButtonPackageExport &&  <Button
            type="primary"
            onClick={ requestWarehouseExport && requestWarehouseExport}
            style={{ marginRight: "10px" }}
            disabled={disabledButtonExport}
            loading={isSubmitLoading}
          >
            Yêu cầu xuất kho
        </Button>}
        {/* {
          splitBill
          && <Button
            style={{ marginRight: "10px" }}
            onClick={onOpenSplitBillForm} type="primary">
            Tách đơn hàng
          </Button>
        } */}
        {
          isConfirmChangeLogistic ?
            <Popconfirm
              title="Nếu bạn thay đổi kho vận chuyển, phí vận chuyển sẽ phải được tính lại"
              onConfirm={() => form.submit()}
              onCancel={onCancel && onCancel}
            >
                <Button
                type="primary"
                // htmlType="submit"
                style={{ marginRight: "10px" }}
                loading={isLoadingWarehouse}
              >
                {title ?? "Chọn"}
              </Button>
            </Popconfirm>
          :
            <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "10px" }}
            loading={isLoadingWarehouse}
          >
            {title ?? "Chọn"}
          </Button>
        }
          
        </Row>
      </Form>
  );
}
