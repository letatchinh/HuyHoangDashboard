import { Tabs, Typography } from "antd";
import { keys } from "lodash";
import React, { useState } from "react";
import WhiteBox from "~/components/common/WhiteBox";
import ListQuotation from "../components/ListQuotation";
import { STATUS_QUOTATION, STATUS_QUOTATION_VI } from "../constants";
type propsType = {};
const CLONE_STATUS_QUOTATION_VI: any = STATUS_QUOTATION_VI;
export default function Quotation(props: propsType): React.JSX.Element {
  const [activeKey, setActiveKey] = useState<string>("ALL");
  
  const onChangeTab = (tab: string) => {
    setActiveKey(tab);
  };
  return (
    <div>
      <Typography.Title level={3}>Danh sách đơn hàng tạm</Typography.Title>
      <WhiteBox>
        <Tabs
          defaultActiveKey={activeKey}
          destroyInactiveTabPane
          onChange={onChangeTab}
        >
          <Tabs.TabPane active={"ALL" === activeKey} tab={"Tất cả đơn hàng tạm"}>
            <ListQuotation />
          </Tabs.TabPane>
          {keys(STATUS_QUOTATION).map((status) => (
            <Tabs.TabPane
              key={status}
              active={status === activeKey}
              tab={CLONE_STATUS_QUOTATION_VI[status]}
            >
              <ListQuotation status={status}/>
            </Tabs.TabPane>
          ))}
        </Tabs>
      </WhiteBox>
    </div>
  );
}
