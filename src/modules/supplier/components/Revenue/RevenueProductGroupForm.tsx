import { Button, Col, DatePicker, Form, InputNumber, Row, Space } from "antd";
import React, { useEffect, useState } from "react";
import { formatNumberThreeComma } from "~/utils/helpers";
import { useResetActionInRevenue, useResetActionInTotalRevenue } from "../../supplier.hook";
type propsType = {
  revenue?: number | null;
  id: any;
  onClose: () => void,
  onUpdate: (value: any, id: any) => void;
  isLoadingSubmit: boolean
};
export default function RevenueProductGroupForm({
  revenue,
  id,
  onClose,
  onUpdate,
  isLoadingSubmit
}: propsType): React.JSX.Element {
  const [revenueValue, setRevenueValue] = useState<number | null | undefined>(0);
  useResetActionInTotalRevenue();

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
        <Col flex={1}>Doanh số khoán cho nhóm sản phẩm:</Col>
        <Col flex={1} >
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
          <Button onClick={onClose}>Huỷ</Button>
        </Col>
        <Col span={4}>
          <Button
            type="primary"
            onClick={() => onUpdate(revenueValue, id)}
            loading = {isLoadingSubmit}
          >
            Cập nhật
          </Button>
        </Col>
      </Row>
    </div>
  );
};