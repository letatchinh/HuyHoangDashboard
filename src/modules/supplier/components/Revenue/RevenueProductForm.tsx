import { Button, Col, DatePicker, Form, InputNumber, Row, Space, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { formatNumberThreeComma } from "~/utils/helpers";
import { useResetActionInRevenue, useResetActionInTotalRevenue } from "../../supplier.hook";
import apis from "../../supplier.api";
type propsType = {
  revenue?: number | null;
  id: any;
  closeFormUpdateRevenue: () => void,
  onUpdateRevenue: (value: any, id: any) => void;
  productName: string,
  totalRevenueId: any,
  productGroupId: any,
  refetch: boolean,
};
export default function RevenueProductForm({
  revenue,
  id,
  closeFormUpdateRevenue,
  onUpdateRevenue,
  productName,
  totalRevenueId,
  productGroupId,
  refetch,
}: propsType): React.JSX.Element {
  const [revenueValue, setRevenueValue] = useState<number | null | undefined>(0);
  const [totalRevenueInfo, setTotalRevenueInfo] = useState<any>({});
  const [loading, setLoading] = useState<boolean>(false);
  
  useResetActionInTotalRevenue();

  const getTotalRevenue = async () => {
    setLoading(true);
    const res = await apis.getTotalProductGroupsAndListProductRevenue({
      supplierMineral: totalRevenueId,
      productGroupId: productGroupId
    });
    setTotalRevenueInfo(res);
    setLoading(false);
  };

  useEffect(() => {
    getTotalRevenue();
  }, [totalRevenueId, productGroupId,id,refetch]);

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
      <h6>Tổng số doanh số khoán cho nhóm: {loading ?<Spin/>: formatNumberThreeComma(totalRevenueInfo?.totalProductGroup) || 0}đ</h6>
      <h6>Tổng đã khoán cho cho các sản phẩm trong nhóm: {loading ?<Spin/>: formatNumberThreeComma(totalRevenueInfo?.totalProduct) || 0}đ</h6>
      <Row  style={{marginTop: 30}}>
        <Col span={12}>Doanh số khoán cho sản phẩm:</Col>
        <Col flex={1}>
          <InputNumber
            style={{
              width: "100%",
            }}
            value={revenueValue}
            onChange={(value) => setRevenueValue(value)}
            formatter={value => formatNumberThreeComma(value)}
            min={0}
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
