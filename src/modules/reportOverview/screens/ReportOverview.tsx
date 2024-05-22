import { Col, Row, Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import { useGetRole } from "~/modules/auth/auth.hook";
import ReportOverviewComponent from "../components/ReportOverviewComponent";
import { hookReportType, useChangeParam, useReportProductSupplierQueryParams } from "../reportOverview.hook";
import ReportChart from "../components/ReportChart";

const omitF = {omitField:['page','limit']} as hookReportType.propsHook

type propsType = {};

export default function ReportOverview(props: propsType): React.JSX.Element {
  const role = useGetRole();
  const [query] = useReportProductSupplierQueryParams(omitF);
  const changeParam = useChangeParam(query)
  return (
    <>
      <Breadcrumb title={"Báo cáo tổng quan"} />
      <Tabs
      type="card"
      onChange={(value)=>{
        changeParam({
          spaceType: value,
          dataType:'groupProduct'
        })
      }}
      style={{
        height: "calc(100% - 68px)",
      }}
      >
        <TabPane tab="Tổng quan" key={'overview'}>
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
        {role !== "partner" && (
          <TabPane tab="OTC" key={'pharma_profile'}>
            <ReportChart query={query} spaceType={"pharma_profile"} />
          </TabPane>
        )}
        <TabPane tab="B2C" style={{ height: "100%" }} key={'partner'}>
          <ReportChart query={query} spaceType={"partner"}/>
        </TabPane>
      </Tabs>
    </>
  );
}
