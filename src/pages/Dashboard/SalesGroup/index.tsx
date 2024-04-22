import { Tabs } from "antd";
import TabPane from "antd/es/tabs/TabPane";
import Breadcrumb from "~/components/common/Breadcrumb";
import { useGetRole } from "~/modules/auth/auth.hook";
import SalesGroup from "~/modules/salesGroup";
import BuyGroup from "~/modules/salesGroup/components/BuyGroup/index";
import { SalesGroupProvider } from "~/modules/salesGroup/salesGroupContext";
const SalesGroupPage = () => {
  const role = useGetRole();
  return (
    <>
    <Breadcrumb title={"Nhóm bán hàng"} />
    <Tabs
    type="card"
    style={{
      height: "calc(100% - 68px)",
    }}
    >
      {role !== 'partner' && <TabPane tab="Nhóm bán hàng OTC" key={1}>
        <SalesGroupProvider>
          <SalesGroup.page.index />
        </SalesGroupProvider>
      </TabPane>}
      <TabPane tab="Nhóm bán hàng B2C" style={{height:'100%'}} key={2}>
        <BuyGroup />
      </TabPane>
    </Tabs>
      </>
  );
};

export default SalesGroupPage;
