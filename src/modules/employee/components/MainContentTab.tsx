import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import POLICIES from "~/modules/policy/policy.auth";
import { useMatchPolicy } from "~/modules/policy/policy.hook";
import DetailTab from "./DetailTab";
import ProductIntroduction from "./ProductIntroduction";
type propsType = {};
export default function MainContentTab(props: propsType): React.JSX.Element {
  const { id: employeeId }: any = useParams();
  const canReadEmployee = useMatchPolicy(POLICIES.READ_EMPLOYEE);
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
        <DetailTab employeeId={employeeId} />
      </TabPane>
      <TabPane tab="Sản phẩm giới thiệu" key="2">
        <ProductIntroduction employeeId={employeeId} />
      </TabPane>
    </Tabs>
  );
}
