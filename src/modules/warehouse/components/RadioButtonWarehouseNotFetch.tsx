import React, { useEffect, useMemo, useState } from "react";
import { useGetProfile } from "~/modules/auth/auth.hook";
import { useFetchState } from "~/utils/hook";
import apis from "../warehouse.api";
import { get, head } from "lodash";
import { Button, Dropdown, Form, Radio, RadioChangeEvent, Row, Space, Spin } from "antd";
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
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const { onNotify } = useNotificationStore();
  const onChange = (e: RadioChangeEvent) => {
    setValue(e.target.value);
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
                  <Radio value={get(item, "_id")}>
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
