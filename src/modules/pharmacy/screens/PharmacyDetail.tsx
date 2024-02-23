import { Tabs } from "antd";
// import TabPane from "antd/es/tabs/TabPane";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import HistoryPharmacy from "../component/HistoryPharmacy";
import DebtPharmacy from "../component/DebtPharmacy";
import POLICIES from "../../policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import WhiteBox from "~/components/common/WhiteBox";
import Breadcrumb from "~/components/common/Breadcrumb";
import useTranslate from "~/lib/translation";
import BackBtn from "~/components/common/BackBtn";
import { PATH_APP } from "~/routes/allPath";

const { TabPane } = Tabs;

export default function PharmacyDetail() {
  const { t }: any = useTranslate();
  const { id: pharmacyId }: any = useParams();

  const [activeTab, setActiveTab] = useState("1");
  const onChangeTab = (key: string) => {
    setActiveTab(key);
  };
  // const isMatchUser = useMatchPolicy(POLICIES.READ_USER);
  // const isMatchUserGroup = useMatchPolicy(POLICIES.READ_USERGROUP);

  return (
    <div>
      <BackBtn label={"Nhà thuốc"} path={PATH_APP.pharmacy.root} />
      <h3>Chi tiết nhà thuốc</h3>
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
