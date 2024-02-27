import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { useCallback, useState } from "react";
import WhiteBox from "~/components/common/WhiteBox";
import LkTabItem from "./LkTabItem";

type propsType = {};
export default function Lk(props: propsType): React.JSX.Element {
  const [activeTab, setActiveTab] = useState("1");
  const onChangeTab = useCallback((tab: string) => {
    setActiveTab(tab);
  }, []);
  return (
    <div>
      <h5>Các mặt hàng luỹ kế đã tích luỹ</h5>
      <WhiteBox>
        <Tabs
          defaultActiveKey="1"
          onChange={(value: string) => onChangeTab(value)}
          destroyInactiveTabPane
          activeKey={activeTab}
        >
          <TabPane tab="Luỹ kế đang tích luỹ" key="1">
            <LkTabItem cumulativeSession="IN" />
          </TabPane>
          <TabPane tab="Luỹ kế đã tích luỹ" key="2">
            <LkTabItem
              cumulativeSession="OUT"
              options={{
                action: true,
                showVoucher: true,
              }}
            />
          </TabPane>
        </Tabs>
      </WhiteBox>
    </div>
  );
}
