import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
// import TabPane from "antd/es/tabs/TabPane";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import POLICIES from "../../policy/policy.auth";
import AccumulationPharmacy from "../component/AccumulationPharmacy";
import DebtPharmacy from "../component/DebtPharmacy";
import HistoryPharmacy from "../component/HistoryPharmacy";
import InformationDetail from "../component/InformationDetail";

type propsType = {

}
export default function MainContentTab(props:propsType) : React.JSX.Element {
    const { id: pharmacyId }: any = useParams();
    const canReadDebt = useMatchPolicy(POLICIES.READ_DEBTPHARMACY);
    const canReadHistory = useMatchPolicy(POLICIES.READ_HISTORYBILLPHARMA);
    const canReadAccumulate = useMatchPolicy(POLICIES.READ_ACCUMULATEPHARMAPROFILE);
  
    const [activeTab, setActiveTab] = useState("1");
    const onChangeTab = (key: string) => {
      setActiveTab(key);
    };
    

    return (
        <Tabs
          className={"layoutDetail--right__mainContent__tab"}
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
    )
}