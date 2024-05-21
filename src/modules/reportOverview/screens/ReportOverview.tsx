import { Col, Row, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import { useGetRole } from "~/modules/auth/auth.hook";
import ReportOverviewComponent from "../components/ReportOverviewComponent";
type propsType = {};
export default function ReportOverview(props: propsType): React.JSX.Element {
  const role = useGetRole();
  return (
    <>
      <Breadcrumb title={"Báo cáo tổng quan"} />
      <Tabs>
        <TabPane tab="Tổng quan" key={1}>
          <Row justify="space-around" align={'middle'} wrap={true}>
            <Col  style={{width:'650px'}}>
              <ReportOverviewComponent typeMatch={"SUPPLIER"} />
            </Col>
            <Col  style={{width:'650px'}}>
              <ReportOverviewComponent typeMatch={"SALE_CHANNEL"} />
            </Col>
            <Col  style={{width:'650px'}}>
              <ReportOverviewComponent typeAreaMatch="area" typeMatch="AREA" />
            </Col>
            <Col  style={{width:'650px'}}>
              <ReportOverviewComponent typeAreaMatch="city" typeMatch="AREA" />
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </>
  );
}
