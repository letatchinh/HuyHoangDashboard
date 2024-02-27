import { Button, Col, DatePicker, Form, InputNumber, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { formatNumberThreeComma } from "~/utils/helpers";
import { useResetActionInRevenue } from "../../supplier.hook";
type propsType = {
  revenue?: number | null;
  id: any;
  closeFormUpdateRevenue: () => void,
  onUpdateRevenue: (value: any, id: any) => void;
  productName: string,
};
export default function UpdateRevenueForm({
  revenue,
  id,
  closeFormUpdateRevenue,
  onUpdateRevenue,
  productName,
}: propsType): React.JSX.Element {
  const [revenueValue, setRevenueValue] = useState<number | null | undefined>(0);
  useResetActionInRevenue();

  useEffect(() => {
    setRevenueValue(revenue);
  }, [revenue]);
  return (
    <div
      style={{
        backgroundColor: "#fff",
        padding: 10,
      }}
    >
      <Row>
        <Col span={12}>Doanh số khoán cho sản phẩm:</Col>
        <Col flex={1}>
          <InputNumber
            style={{
              width: "100%",
            }}
            value={revenueValue}
            onChange={(value) => setRevenueValue(value)}
            formatter={value => formatNumberThreeComma(value)}
          />
        </Col>
      </Row>
      <Row justify={"end"} gutter={12} style={{marginTop: 30}}>
        <Col span={4}>
          <Button onClick={closeFormUpdateRevenue}>Huỷ</Button>
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            onClick={() => onUpdateRevenue(revenueValue, id)}
          >
            Cập nhật
          </Button>
        </Col>
      </Row>
    </div>
  );
}
