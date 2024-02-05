import { Tabs } from "antd";
// import TabPane from "antd/es/tabs/TabPane";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";

import HistoryPharmacy from "../component/HistoryPharmacy";
import DebtPharmacy from "../component/DebtPharmacy";
import POLICIES from "../../policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import WhiteBox from "~/components/common/WhiteBox";

const { TabPane } = Tabs;

export default function PharmacyDetail() {
  const [pharmacyId, setPharmacyId] = useState<string | null>("");
  const [activeTab, setActiveTab] = useState("1");
  const onChangeTab = (key: string) => {
    setActiveTab(key);
  };
  // const isMatchUser = useMatchPolicy(POLICIES.READ_USER);
  // const isMatchUserGroup = useMatchPolicy(POLICIES.READ_USERGROUP);

  return (
    <div>
      <WhiteBox>
        <Tabs
          defaultActiveKey="1"
          onChange={(e) => onChangeTab(e)}
          destroyInactiveTabPane
          activeKey={activeTab}
        >
          <TabPane tab="Lịch sử" key="1">
            <HistoryPharmacy pharmacyId={pharmacyId} />
          </TabPane>
          <TabPane tab="Công nợ" key="2">
            <DebtPharmacy pharmacyId={pharmacyId} />
          </TabPane>
        </Tabs>
      </WhiteBox>
    </div>
  );
}
