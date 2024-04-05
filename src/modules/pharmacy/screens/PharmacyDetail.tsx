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
import AccumulationPharmacy from "../component/AccumulationPharmacy";
import InformationDetail from "../component/InformationDetail";
import { useIsAdapterSystem } from "~/utils/helpers";

const { TabPane } = Tabs;

export default function PharmacyDetail() {
  const { t }: any = useTranslate();
  const { id: pharmacyId }: any = useParams();
  const isAdapterSystem = useIsAdapterSystem();
  const canReadDebt = useMatchPolicy(POLICIES.READ_DEBTPHARMACY);
  const canReadHistory = useMatchPolicy(POLICIES.READ_HISTORYBILLPHARMA);
  const canReadAccumulate = useMatchPolicy(POLICIES.READ_ACCUMULATEPHARMAPROFILE);

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
          <TabPane tab="Thông tin" key="1">
            <InformationDetail pharmacyId={pharmacyId} />
          </TabPane>
        {canReadHistory &&  <TabPane tab="Lịch sử" key="2">
            <HistoryPharmacy pharmacyId={pharmacyId} />
          </TabPane>}
        { canReadDebt && <TabPane tab="Công nợ" key="3">
            <DebtPharmacy pharmacyId={pharmacyId} />
          </TabPane>}
          {canReadAccumulate &&<TabPane tab="Tích luỹ sản phẩm" key="4">
            <AccumulationPharmacy pharmacyId={pharmacyId} targetType="PRODUCT"/>
          </TabPane>}
          {canReadAccumulate &&<TabPane tab="Tích luỹ danh mục" key="5">
          <AccumulationPharmacy pharmacyId={pharmacyId} targetType="GROUP"/>
          </TabPane>}
        </Tabs>
      </WhiteBox>
    </div>
  );
}
