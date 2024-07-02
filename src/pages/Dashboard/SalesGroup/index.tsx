import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useState } from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import { useGetRole } from "~/modules/auth/auth.hook";
import SalesGroup from "~/modules/salesGroup";
import BuyGroup from "~/modules/salesGroup/components/BuyGroup/index";
import { SalesGroupProvider } from "~/modules/salesGroup/salesGroupContext";
const SalesGroupPage = () => {
  const role = useGetRole();
  const [activeKey, setKeyActive] = useState<'B2B' | 'B2C'>(role === 'partner' ? 'B2C' : ("B2B" ?? "B2C"));
  return (
    <>
    <Breadcrumb title={"Nhóm bán hàng"} />
    <Tabs
      activeKey={activeKey}
      onChange={(key:any)=>setKeyActive(key)}
      type="card"
      style={{
        height: "calc(100% - 68px)",
      }}
      // defaultActiveKey= {(role === 'partner' ? 'B2C': ("B2B" ?? "B2C"))} 
      destroyInactiveTabPane
    >
      {role !== 'partner' && <TabPane tab="Nhóm bán hàng B2B" key={'B2B'}>
        <SalesGroupProvider>
          <SalesGroup.page.index />
        </SalesGroupProvider>
      </TabPane>}
      <TabPane tab="Nhóm bán hàng B2C" style={{height:'100%'}} key={'B2C'}>
        <BuyGroup activeKey={activeKey}/>
      </TabPane>
    </Tabs>
      </>
  );
};

export default SalesGroupPage;
