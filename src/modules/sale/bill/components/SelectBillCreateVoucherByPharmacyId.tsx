import { Form, Select } from "antd";
import React, { useMemo } from "react";
import { requireRules } from "~/constants/defaultValue";
import { useFetchState } from "~/utils/hook";
import apis from "../bill.api";
type propsType = {
  id?: string;
  optionsDefault?: any;
};
type ResponseGetBill = {
  codeSequence: string;
  _id: string;
};
export default function SelectBillCreateVoucherByPharmacyId({
  id,
  optionsDefault,
}: propsType): React.JSX.Element {
  const query = useMemo(() => id, [id]);
  const [bill, isLoading] = useFetchState({
    api: apis.getBillToReceiptVoucher,
    query,
    useDocs: false,
    nullNotFetch: true,
  });
  const options = useMemo(
    () =>
      bill?.map((item: ResponseGetBill) => ({
        value: item?._id,
        label: item?.codeSequence,
      })),
    [bill]
  );
  const newOptionsDefault = useMemo(() => ([{
    value: optionsDefault?._id,
    label: optionsDefault?.codeSequence,
  }]),[optionsDefault])
  return (
    <Form.Item shouldUpdate noStyle>
      {({ getFieldValue }) =>
        getFieldValue("method")?.type === "BILL" && (
          <Form.Item
            rules={requireRules}
            label="Đơn hàng"
            name={["method", "data", "_id"]}
            labelCol={{ lg: 8 }}
          >
            <Select options={ id ? newOptionsDefault : options} loading={isLoading} />
          </Form.Item>
        )
      }
    </Form.Item>
  );
}
