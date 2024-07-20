import { Table } from 'antd';
import React, { useMemo } from 'react';
import useInventoryWarehouseStore from '../../store/InventoryStore';
type propsType = {

}
export default function ListProductInventory(props: propsType): React.JSX.Element {
  const {activeTab, loading} = useInventoryWarehouseStore();
  const columns = useMemo(
    () => [
      {
        title: 'Tên sản phẩm',
        dataIndex: 'name',
        key: 'name',
        width : 200,
      },
      {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
        width : 200,
      },
      {
        title: 'Đơn vị',
        dataIndex: 'unit',
        key: 'unit',
        width : 200,
      },
  ], [activeTab]);
  return (
    <Table
    columns={columns}
    dataSource={[]}
    pagination={false}
    loading={loading}
    />
  )
}