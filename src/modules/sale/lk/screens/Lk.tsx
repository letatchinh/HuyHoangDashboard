import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { useCallback, useEffect, useState } from "react";
import WhiteBox from "~/components/common/WhiteBox";
import { getValueQuery } from "~/utils/helpers";
import { useChangeDocumentTitle } from "~/utils/hook";
import LkTabItem from "./LkTabItem";

type propsType = {};
export default function Lk(props: propsType): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"IN" | "OUT">("IN");
  const onChangeTab = useCallback((tab: "IN" | "OUT") => {
    setActiveTab(tab);
  }, []);
  useEffect(() => {
    // Init Tab
    const defaultCumulativeSession : "IN" | "OUT" = getValueQuery('cumulativeSession');
    setActiveTab(defaultCumulativeSession ?? "IN");
  },[]);

  useChangeDocumentTitle("Luỹ kế mặt hàng")
  return (
    <div>
      <h5>Các mặt hàng luỹ kế đã tích luỹ</h5>
      <WhiteBox>
        <Tabs
          defaultActiveKey="IN"
          onChange={(value: any) => onChangeTab(value)}
          destroyInactiveTabPane
          activeKey={activeTab}
        >
          <TabPane tab="Luỹ kế đang tích luỹ" key="IN">
            <LkTabItem cumulativeSession="IN" 
            options={{showIsDone : true}}
            />
          </TabPane>
          <TabPane tab="Luỹ kế đã tích luỹ" key="OUT">
            <LkTabItem
              cumulativeSession="OUT"
              options={{
                action: true,
                showSession : true,
                showIsDone : false,
              }}
            />
          </TabPane>
        </Tabs>
      </WhiteBox>
    </div>
  );
}
