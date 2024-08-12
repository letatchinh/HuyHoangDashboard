import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useEffect } from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import { useGetRole } from "~/modules/auth/auth.hook";
import ReportChart from "../components/ReportChart";
import { hookReportType, useChangeParam, useReportProductSupplierQueryParams } from "../reportProductSupplier.hook";
const omitF = {omitField:['page','limit']} as hookReportType.propsHook

export default function ReportProductSupplier() {
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
        {role !== "partner" && (
          <TabPane tab="B2B" key={'pharma_profile'}>
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
