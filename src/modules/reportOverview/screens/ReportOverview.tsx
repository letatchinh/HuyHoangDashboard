import { Col, Radio, Row, Space, Tabs, Typography } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { useState } from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import { useGetRole } from "~/modules/auth/auth.hook";
import ReportOverviewComponent from "../components/ReportOverviewComponent";
import {
  hookReportType,
  useChangeParam,
  useReportProductSupplierQueryParams,
} from "../reportOverview.hook";
import ReportChart from "../components/ReportChart";

const omitF = { omitField: ["page", "limit"] } as hookReportType.propsHook;

type propsType = {};

export default function ReportOverview(props: propsType): React.JSX.Element {
  const role = useGetRole();
  const [query] = useReportProductSupplierQueryParams(omitF);
  const changeParam = useChangeParam(query);
  const [displayMode, setDisplayMode] = useState<string>("PERCENT");  
  const handleRadioChange = (e?: any) => {
    setDisplayMode(e.target.value);
  };
  return (
    <>
      <Breadcrumb title={"Báo cáo tổng quan"} />
      <Tabs
        type="card"
        onChange={(value) => {
          changeParam({
            spaceType: value,
            dataType: "groupProduct",
          });
        }}
        style={{
          height: "calc(100% - 68px)",
        }}
        defaultValue={"overview"}
        destroyInactiveTabPane
      >
        <TabPane tab="Tổng quan" key={"overview"}>
          <Row>
            <Space style={{ marginBottom: 20 }}>
              <Typography style={{ fontSize: 14, marginRight: 20 }}>
                Kiểu hiển thị:
              </Typography>
              <Row gutter={14}>
                <Radio.Group
                   onChange={handleRadioChange}
                  optionType="button"
                  buttonStyle="solid"
                  defaultValue={"PERCENT"}
                >
                  <Radio.Button value="PERCENT">Tỉ lệ %</Radio.Button>
                  <Radio.Button value="VALUE">Doanh thu</Radio.Button>
                </Radio.Group>
              </Row>
            </Space>
          </Row>
          <Row justify="space-around" align={"middle"} wrap={true}>
            <Col style={{ width: "650px" }}>
              <ReportOverviewComponent
                typeMatch={"SUPPLIER"}
                titleName="Nhà cung cấp"
                displayMode={displayMode}
              />
            </Col>
            <Col style={{ width: "650px" }}>
              <ReportOverviewComponent
                typeMatch={"SALE_CHANNEL"}
                titleName="Kênh bán hàng"
                displayMode={displayMode}
              />
            </Col>
            <Col style={{ width: "650px" }}>
              <ReportOverviewComponent
                typeAreaMatch="area"
                typeMatch="AREA"
                titleName="Vùng/ Miền"
                displayMode={displayMode}
              />
            </Col>
            <Col style={{ width: "650px" }}>
              <ReportOverviewComponent
                typeAreaMatch="city"
                typeMatch="AREA"
                titleName="Tỉnh/ Thành phố"
                displayMode={displayMode}
              />
            </Col>
          </Row>
        </TabPane>
        {role !== "partner" && (
          <TabPane tab="B2B" key={"pharma_profile"}>
            <ReportChart query={query} spaceType={"pharma_profile"} />
          </TabPane>
        )}
        <TabPane tab="B2C" style={{ height: "100%" }} key={"partner"}>
          <ReportChart query={query} spaceType={"partner"} />
        </TabPane>
      </Tabs>
    </>
  );
}
