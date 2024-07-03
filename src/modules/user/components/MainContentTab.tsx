import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import React, { useState } from "react";
import { useParams } from "react-router-dom";
import UserForm from "./UserForm";

type propsType = {

}

export default function MainContentTab(props:propsType) : React.JSX.Element {
    const { id }: any = useParams();
  
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
            <UserForm id={id}  readOnly/>
          </TabPane>
        </Tabs>
    )
}