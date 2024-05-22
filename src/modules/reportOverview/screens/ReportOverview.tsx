import { Col, Radio, Row, Space, Tabs, Typography } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React from "react";
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
      >
        <TabPane tab="Tổng quan" key={"overview"}>
          {/* <Row>
            <Space style={{ marginBottom: 20 }}>
              <Typography style={{ fontSize: 14, marginRight: 20 }}>
                Kiểu hiển thị:
              </Typography>
              <Row gutter={14}>
                <Radio.Group
                  // onChange={onChange}
                  optionType="button"
                  buttonStyle="solid"
                  defaultValue={1}
                >
                  <Radio.Button value={1}>Tỉ lệ %</Radio.Button>
                  <Radio.Button value={2}>Doanh thu</Radio.Button>
                </Radio.Group>
              </Row>
            </Space>
          </Row> */}
          <Row justify="space-around" align={"middle"} wrap={true}>
            <Col style={{ width: "650px" }}>
              <ReportOverviewComponent
                typeMatch={"SUPPLIER"}
                titleName="Nhà cung cấp"
              />
            </Col>
            <Col style={{ width: "650px" }}>
              <ReportOverviewComponent
                typeMatch={"SALE_CHANNEL"}
                titleName="Kênh bán hàng"
              />
            </Col>
            <Col style={{ width: "650px" }}>
              <ReportOverviewComponent
                typeAreaMatch="area"
                typeMatch="AREA"
                titleName="Vùng/ Miền"
              />
            </Col>
            <Col style={{ width: "650px" }}>
              <ReportOverviewComponent
                typeAreaMatch="city"
                typeMatch="AREA"
                titleName="Tỉnh/ Thành phố"
              />
            </Col>
          </Row>
        </TabPane>
        {role !== "partner" && (
          <TabPane tab="OTC" key={"pharma_profile"}>
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
