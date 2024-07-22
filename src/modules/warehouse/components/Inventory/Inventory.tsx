import React from "react";
import WhiteBox from "~/components/common/WhiteBox";
import { Spin, Tabs, Typography } from "antd";
import ListProductInventory from "./ListProductInventory";
import useInventoryWarehouseStore, {
  InventoryWarehouseProvider,
} from "../../store/InventoryStore";
type propsType = {};
export default function InventoryScreen(props: propsType): React.JSX.Element {
  const { listWarehouse, setActiveTab, activeTab, isLoading, onSearch} =useInventoryWarehouseStore();
  return isLoading ? (
    <div>Đang tải... <Spin/></div>
  ) : (
    <>
      <Typography.Title level={3}>
        Danh sách sản phẩm cần nhập hàng theo kho
      </Typography.Title>
      <WhiteBox style={{height: 'unset'}}>
        <Tabs
          destroyInactiveTabPane
            onChange={(key: any) => {
              setActiveTab && setActiveTab(key);
              onSearch &&  onSearch({
                warehouseId: key
              })
          }}
          defaultActiveKey={activeTab}
        >
          {listWarehouse?.map((warehouse: any) => (
            <Tabs.TabPane
              tab={warehouse?.name?.vi}
              key={String(warehouse?._id)}
            >
              <ListProductInventory />
            </Tabs.TabPane>
          ))}
        </Tabs>
      </WhiteBox>
    </>
  );
}
