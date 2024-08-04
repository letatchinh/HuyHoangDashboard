import { Tabs } from "antd";
import { TabsProps } from "antd/lib/index";
import React, { useState } from "react";

export default function MainContentTabCommon(props:TabsProps) : React.JSX.Element {
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
          {...props}
        />
    )
}