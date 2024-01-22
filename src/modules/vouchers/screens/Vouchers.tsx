import { Table, Tabs } from "antd";
import React, { useState } from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
type propsType = {};
export default function Vouchers(props: propsType): React.JSX.Element {
    const [activeTab, setActiveTab] = useState("1");
  return (
    <div>
      <WhiteBox>
        <Breadcrumb title="Sổ quỹ" />
        <SelectSearch />
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Phiếu thu" key="1">
            <Table />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Phiếu chi" key="2">
            <Table />
          </Tabs.TabPane>
        </Tabs>
      </WhiteBox>
    </div>
  );
}
