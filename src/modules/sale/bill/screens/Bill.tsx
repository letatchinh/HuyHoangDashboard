import { Tabs, Typography } from "antd";
import { keys, omit } from "lodash";
import React, { useState } from "react";
import WhiteBox from "~/components/common/WhiteBox";
import { useChangeDocumentTitle } from "~/utils/hook";
import ListBill from "../components/ListBill";
import { STATUS_BILL, STATUS_BILL_VI } from "../constants";
type propsType = {};
const CLONE_STATUS_BILL_VI: any = omit(STATUS_BILL_VI, ['READY']);
export default function Bill(props: propsType): React.JSX.Element {
  const [activeKey, setActiveKey] = useState<string>("ALL");
  
  const onChangeTab = (tab: string) => {
    setActiveKey(tab);
  };
  useChangeDocumentTitle("Danh sách đơn bán")

  return (
    <div>
      <Typography.Title level={3}>Danh sách đơn hàng</Typography.Title>
      <WhiteBox>
        <Tabs
          defaultActiveKey={activeKey}
          destroyInactiveTabPane
          onChange={onChangeTab}
        >
          <Tabs.TabPane active={"ALL" === activeKey} tab={"Tất cả đơn hàng"}>
            <ListBill/>
          </Tabs.TabPane>
          {keys(omit(STATUS_BILL, ["READY", "UNREADY"])).map((status) => (
            <Tabs.TabPane
              key={status}
              active={status === activeKey}
              tab={CLONE_STATUS_BILL_VI[status]}
            >
              <ListBill status={status}/>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </WhiteBox>
    </div>
  );
}
