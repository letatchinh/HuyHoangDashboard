import { Tabs } from "antd";
import React, { useState } from "react";
import useSplitBillStore from "../../storeContext/SplitBillContext";
import TabSplitBill from "./TabSplitBill";
type propsType = {};
export default function SplitBillForm({}: propsType): React.JSX.Element {
  const { data } =
    useSplitBillStore();
  const [activeKey, setActiveKey] = useState("1");
  return (
    <Tabs
      defaultActiveKey="1"
      activeKey={activeKey}
      onChange={(key) => setActiveKey(key)}
      type="card"
      destroyInactiveTabPane
      size="small"
      style={{ width: "100%" }}
      tabBarStyle={{ marginBottom: 20 }}
    >
      {data?.map((item: any, index: number) => (
        <Tabs.TabPane
          tab={`Đơn hàng ${index + 1}`}
          key={String(index + 1)}
          className="w-100"
        >
          <TabSplitBill data={item} />
        </Tabs.TabPane>
      ))}
    </Tabs>
  );
}
