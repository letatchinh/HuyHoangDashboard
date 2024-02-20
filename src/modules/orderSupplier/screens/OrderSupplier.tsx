import { Tabs, Typography } from "antd";
import { keys } from "lodash";
import React, { useState } from "react";
import WhiteBox from "~/components/common/WhiteBox";
import { STATUS_BILL, STATUS_BILL_VI } from "../constants";
import ListOrder from "../components/ListOrder";
type propsType = {};
const CLONE_STATUS_BILL_VI: any = STATUS_BILL_VI;
export default function OrderSupplier(props: propsType): React.JSX.Element {
  const [activeKey, setActiveKey] = useState<string>("ALL");

  const onChangeTab = (tab: string) => {
    setActiveKey(tab);
  };
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
            <ListOrder />
          </Tabs.TabPane>
          {keys(STATUS_BILL).map((status) => (
            <Tabs.TabPane
              key={status}
              active={status === activeKey}
              tab={CLONE_STATUS_BILL_VI[status]}
            >
              <ListOrder status={status} />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </WhiteBox>
    </div>
  );
}
