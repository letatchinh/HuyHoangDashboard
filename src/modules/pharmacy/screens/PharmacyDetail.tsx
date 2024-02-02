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

export default function PharmacyDetail(callback: any) {
  const [currentTab, setCurrentTab] = useState("");
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const isMatchUser = useMatchPolicy(POLICIES.READ_USER);
  const isMatchUserGroup = useMatchPolicy(POLICIES.READ_USERGROUP);

  return (
    <div>
      <WhiteBox>
        <Tabs defaultActiveKey="1" onChange={callback}>
          <TabPane tab="Lịch sử" key="1">
            <HistoryPharmacy />
          </TabPane>
          <TabPane tab="Công nợ" key="2" />
          <DebtPharmacy />
        </Tabs>
      </WhiteBox>
    </div>
  );
}
