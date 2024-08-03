import { Button, Form, Popconfirm, Radio, RadioChangeEvent, Row, Space, Spin } from "antd";
import { get, head } from "lodash";
import React, { useEffect, useState } from "react";
import useNotificationStore from "~/store/NotificationContext";
type propsType = {
  setValue?: (value: number) => void;
  value: number | undefined;
  onClick?: (data?: any) => void ;
  onCancel?: () => void;
  isLoadingWarehouse?: boolean;
  isSubmitLoading?: boolean;
  warehouseDefault?: any
  updateWarehouseInBill?: (data: any) => void;
  listWarehouseLinked: any[];
  onAddWarehouse?: (data: any) => void;
};
export default function RadioButtonWarehouse({
  setValue,
  value,
  onClick,
  isLoadingWarehouse,
  listWarehouseLinked,
  onAddWarehouse
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const { onNotify } = useNotificationStore();
  const onChange = (e: RadioChangeEvent) => {
    setValue && setValue(e.target.value);
  };
  const onFinish = (values: any) => {
    if (!values?.warehouseId) {
      return onNotify?.error("Vui lòng chọn kho");
    };
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
              label={"Kho nhập hàng"}
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
            <Button
            type="primary"
            htmlType="submit"
            style={{ marginRight: "10px" }}
            loading={isLoadingWarehouse}
          >
            Xác nhận
          </Button>
        </Row>
      </Form>
  );
}
