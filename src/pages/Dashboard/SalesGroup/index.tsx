import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import { useState } from "react";
import Breadcrumb from "~/components/common/Breadcrumb";
import { useGetRole } from "~/modules/auth/auth.hook";
import SalesGroup from "~/modules/salesGroup";
import BuyGroup from "~/modules/salesGroup/components/BuyGroup/index";
import { SalesGroupProvider } from "~/modules/salesGroup/salesGroupContext";
const SalesGroupPage = () => {
  const [activeKey,setKeyActive]=useState<'OTC'|'B2C'>('OTC')
  const role = useGetRole();
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
    >
      {role !== 'partner' && <TabPane tab="Nhóm bán hàng OTC" key={'OTC'}>
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
