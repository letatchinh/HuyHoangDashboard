import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import { useGetRole } from "~/modules/auth/auth.hook";
import ReportChart from "../components/ReportChart";

export default function ReportProductSupplier() {
  const role = useGetRole();
  return (
    <>
      <Breadcrumb title={"Báo cáo tổng quan"} />
      <Tabs
        type="card"
        style={{
          height: "calc(100% - 68px)",
        }}
      >
        {role !== "partner" && (
          <TabPane tab="OTC" key={1}>
            <ReportChart spaceType={"pharma_profile"} rangerTime={["2024-02-01", "2024-06-01"]} dataType={"groupProduct"}/>
          </TabPane>
        )}
        <TabPane tab="B2C" style={{ height: "100%" }} key={2}>
          <ReportChart spaceType={"partner"} dataType={"groupProduct"} rangerType={"WEEKLY"}/>
        </TabPane>
      </Tabs>
    </>
  );
}
