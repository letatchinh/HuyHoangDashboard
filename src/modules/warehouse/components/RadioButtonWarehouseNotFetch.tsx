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
  setWarehouseBranchId?: any;
  warehouseDefault?: any
  updateWarehouseInBill?: (data: any) => void;
  isConfirmChangeLogistic?: boolean;
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
  setWarehouseBranchId,
  warehouseDefault,
  updateWarehouseInBill,
  isConfirmChangeLogistic,
  onCancel
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const { onNotify } = useNotificationStore();
  const findWarehouseManagementArea = (warehouseDefault: any, value: any) => {
    return warehouseDefault?.find((item: any) => get(item, "warehouseId") === value)
  };
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    // updateWarehouseInBill && updateWarehouseInBill(e.target.value);
  };
  const onFinish = (values: any) => {
    if (!values?.warehouseId) {
      return onNotify?.error("Vui lòng chọn kho");
    };
    updateWarehouseInBill && updateWarehouseInBill(values?.warehouseId);
    onClick && onClick(values);
  };
  useEffect(() => {
    form.setFieldsValue({ warehouseId: value });
    if (!!warehouseDefault && !!setWarehouseBranchId) {
      setWarehouseBranchId(findWarehouseManagementArea(warehouseDefault, value)?._id);
    };
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
              value={value || get(head(warehouseDefault), "_id")}
            >
              <Space direction="vertical">
                {warehouseDefault?.map((item: any) => (
                  <Radio value={ get(item, "warehouseId")}>
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
