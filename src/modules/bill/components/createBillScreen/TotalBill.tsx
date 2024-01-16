import { Col, Row, Typography } from "antd";
import React from "react";
type propsType = {};
const Layout = ({ label, children,isLarge }: { label: any; children: any , isLarge? : boolean }) => (
  <Row justify={"space-between"} align="middle">
    <Col>
      <Typography.Text style={{ fontSize: isLarge ? 18 : 16, fontWeight: isLarge ? 600 : 400 }}>
        {label}
      </Typography.Text>
    </Col>
    <Col>{children}</Col>
  </Row>
);
export default function TotalBill(props: propsType): React.JSX.Element {
  return (
    <div>
      <Layout label={"Số lượng sản phẩm"}>0</Layout>
      <Layout label={"Tổng tiền"}>0</Layout>
      <Layout label={"Chiết khấu"}>0</Layout>
      <Layout isLarge={true} label={"Tổng tiền phải trả"}>
      <Typography.Text style={{ fontSize:  18 , fontWeight: 600 }}>
        100000
      </Typography.Text>
      </Layout>
    </div>
  );
}
