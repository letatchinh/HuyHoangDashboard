import { Modal, Table, Tabs } from "antd";
import React, { useState } from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import SelectSearch from "~/components/common/SelectSearch/SelectSearch";
import WhiteBox from "~/components/common/WhiteBox";
import PaymentVoucher from "../../paymentVoucher/components/PaymentVoucher";
type propsType = {};
export default function Vouchers(props: propsType): React.JSX.Element {
  const [activeTab, setActiveTab] = useState("1");
  const [open, setOpen] = useState(false);

  return (
    <>
      <WhiteBox>
        <Breadcrumb title="Sổ quỹ" />
        <SelectSearch
          isShowButtonAdd
          handleOnClickButton = {() => setOpen(true)}
        />
        <Tabs defaultActiveKey="1">
          <Tabs.TabPane tab="Phiếu thu" key="1">
            <Table />
          </Tabs.TabPane>
          <Tabs.TabPane tab="Phiếu chi" key="2">
            <Table />
          </Tabs.TabPane>
        </Tabs>
      </WhiteBox>
      <Modal
        title='Phiếu chi'
        open={open}
        onCancel={() => setOpen(false)}
        onOk={() => setOpen(false)}
        width={1366}
        footer={null}
      >
        <PaymentVoucher
          onClose={() => setOpen(false)}
        />
      </Modal>
    </>
  );
}
