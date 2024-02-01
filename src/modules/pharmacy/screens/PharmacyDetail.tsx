import { Tabs } from "antd";
// import TabPane from "antd/es/tabs/TabPane";
import React, { useEffect, useState } from "react";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import WhiteBox from "~/components/common/WhiteBox";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import HistoryPharmacy from "../component/HistoryPharmacy";
import UserGroup from "~/modules/userGroup/screens/UserGroup";
import DebtPharmacy from "../component/DebtPharmacy";

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
