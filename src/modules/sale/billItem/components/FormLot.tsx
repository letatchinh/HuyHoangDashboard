import { Button, DatePicker, Form, Input } from "antd";
import dayjs from "dayjs";
import { get } from "lodash";
import React, { useEffect, useMemo } from "react";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import { StatusBillItemType, UpdateBillItem } from "../billItem.modal";
import { STATUS_BILLITEM } from "../constants";
import PolicyModule from '~/modules/policy';

type propsType = {
  lotNumber: string;
  expirationDate: any;
  status: keyof StatusBillItemType;
  onChangeStatusBillItem: (p: UpdateBillItem) => void;
  id: string;
  isDisabledAll: boolean;
};
type FieldType = {
  lotNumber: string;
  expirationDate: any;
};
export default function FormLot({
  expirationDate,
  lotNumber,
  status,
  onChangeStatusBillItem,
  id,
  isDisabledAll,
}: propsType): React.JSX.Element {
  const [form] = Form.useForm();
  const canUpdateBill = useMatchPolicy(PolicyModule.POLICIES.UPDATE_BILL);
  const isView = useMemo(() => !canUpdateBill || status !== STATUS_BILLITEM.PROCESSING, [status]);
  const onFinish = (values: FieldType) => {
    const submitData: UpdateBillItem = {
      ...values,
      expirationDate: dayjs(get(values, "expirationDate")).format("YYYY-MM-DD"),
      id,
    };
    
    onChangeStatusBillItem(submitData);
  };
  useEffect(() => {
    form.setFieldsValue({
      lotNumber,
      expirationDate: !!expirationDate ? dayjs(expirationDate) : null,
    });
  }, [expirationDate, lotNumber]);
  return isView ? (
    <div>
      <p>Lô : {lotNumber}</p>
      <p>Hạn sử dụng : {dayjs(expirationDate).format("YYYY-MM-DD")}</p>
    </div>
  ) : (
    <Form
      form={form}
      onFinish={onFinish}
      labelCol={{ span: 8 }}
      labelAlign="left"
      className="form-custom"
    >
      <Form.Item<FieldType>
        name={"lotNumber"}
        label="Lô"
        rules={[
          {
            required: true,
            message: "Vui lòng nhập lô!",
          },
        ]}
      >
        <Input placeholder="Vui lòng nhập lô" />
      </Form.Item>

      <Form.Item<FieldType>
        name={"expirationDate"}
        label="Hạn sử dụng"
        rules={[
          {
            required: true,
            message: "Vui lòng chọn ngày hết hạn",
          },
        ]}
      >
        <DatePicker placeholder="Hạn sử dụng" format={"YYYY-MM-DD"} />
      </Form.Item>
      <Button
        size="small"
        disabled={isDisabledAll || status !== STATUS_BILLITEM.PROCESSING}
        htmlType="submit"
        type="primary"
      >
        Cập nhật
      </Button>
    </Form>
  );
}
