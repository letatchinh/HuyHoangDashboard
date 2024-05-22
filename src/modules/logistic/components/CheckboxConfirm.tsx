import { InfoCircleFilled } from "@ant-design/icons";
import { Form, Radio, Tooltip } from "antd";
import React from "react";
type propsType = {
  setCheckboxPayment: (value: any) => void;
  checkboxPayment: string | null;
};

const options = [
  { label: "Công ty", value: "SYSTEM", code: 'SYSTEM' },
  { label: "Khách hàng", value: "CUSTOMER", code: 'GTG071' },
];

export default function CheckboxConfirm({
  checkboxPayment,
  setCheckboxPayment,
}: propsType): React.JSX.Element {
  const onChange = (e: any) => {
    if (e) {
      setCheckboxPayment(e.target.value);
    } else {
      setCheckboxPayment(null);
    }
  };
  return (
    <Form.Item
      name={"addonService"}
      label={
        <Tooltip placement="topRight" title="Nếu người thanh toán là khách hàng, cước vận chuyển sẽ cao hơn vì đơn hàng sẽ phát sinh chi phí thu hộ từ đơn vị vận chuyển">
          Người thanh toán
          <InfoCircleFilled style={{ marginLeft: "5px" }} />
        </Tooltip>
      }
      rules={[{ required: true, message: "Chọn người thanh toán" }]}
    >
      <Radio.Group onChange={onChange} value={checkboxPayment} options={options}/>
    </Form.Item>
  );
}
