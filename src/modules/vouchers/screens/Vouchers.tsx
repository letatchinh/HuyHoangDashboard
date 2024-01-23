import { Modal, Table, Tabs } from "antd";
import React, { useState } from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import PaymentVouchers from "./Payment";
import ReceiptVouchers from "./Receipt";
type propsType = {};
export default function Vouchers(props: propsType): React.JSX.Element {
  const [activeTab, setActiveTab] = useState("1");

  return (
    <>
      <WhiteBox>
        <Breadcrumb title="Sổ quỹ" />
        <SelectSearch
        />
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Phiếu thu" key="1">
            <ReceiptVouchers />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Phiếu chi" key="2">
            <PaymentVouchers/>
          </Tabs.TabPane>
        </Tabs>
      </WhiteBox>
    </>
  );
}
