import { Button, Form, Radio, RadioChangeEvent, Row, Space, Spin } from "antd";
import { get, head } from "lodash";
import React, { useEffect } from "react";
import useNotificationStore from "~/store/NotificationContext";
type propsType = {
  setValue: (value: number) => void;
  value: number | undefined;
  onClick?: (data?: any) => void ;
  onCancel?: () => void;
  title: string;
  listWarehouse?: any[];
  isLoadingWarehouse?: boolean;
  isShowButtonPackageExport?: boolean;
  requestWarehouseExport?: () => void;
  disabledButtonExport?: boolean;
  isSubmitLoading?: boolean;
  setWarehouseBranchId?: any;
  warehouseDefault?: any
};
export default function RadioButtonWarehouse({
  setValue,
  value,
  onClick,
  onCancel,
  title,
  listWarehouse,
  isLoadingWarehouse,
  isShowButtonPackageExport = false,
  disabledButtonExport = false,
  requestWarehouseExport,
  isSubmitLoading,
  setWarehouseBranchId,
  warehouseDefault,
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const { onNotify } = useNotificationStore();
  const findWarehouseManagementArea = (warehouseDefault: any, value: any) => {
    return warehouseDefault?.find((item: any) => get(item, "warehouseId") === value)
  };
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
    if (!!warehouseDefault && !!setWarehouseBranchId) {
      setWarehouseBranchId(findWarehouseManagementArea(warehouseDefault, e.target.value)?._id);
    };
  };
  const onFinish = (values: any) => {
    if (!values?.warehouseId) {
      return onNotify?.error("Vui lòng chọn kho");
    };
    onClick && onClick(values);
  };
  useEffect(() => {
    form.setFieldsValue({ warehouseId: value });
    if (!!warehouseDefault && !!setWarehouseBranchId) {
      setWarehouseBranchId(findWarehouseManagementArea(warehouseDefault, value)?._id);
    };
  }, [value]);
  return (
    <>
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
              value={value || get(head(listWarehouse), "_id")}
            >
              <Space direction="vertical">
                {listWarehouse?.map((item: any) => (
                  <Radio value={get(item, "warehouseId")}>
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
          <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "10px" }}
            loading={isLoadingWarehouse}
          >
            {title ?? "Chọn"}
          </Button>
        </Row>
      </Form>
    </>
  );
}
